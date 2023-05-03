import { BopsEngine } from "../bops-functions/bops-engine/bops-engine.js";
import { ModuleFullName, ModuleManager } from "../bops-functions/bops-engine/modules-manager.js";
import { BusinessOperation } from "../configuration/business-operations/business-operation.js";
import { BopsDependencies, CheckBopsFunctionsDependencies }
  from "../configuration/business-operations/check-bops-functions-dependencies.js";
import { ConfigurationType } from "../configuration/configuration-type.js";
import { SchemaType } from "../configuration/schemas/schemas-type.js";
import { SchemasManager } from "../schemas/application/schemas-manager.js";
import { ModuleType } from "../configuration/business-operations/business-operations-type.js";
import { DependencyPropValidator } from "./dependency-validator.js";
import { logger } from "../common/logger/logger.js";
import { environment } from "../common/execution-env.js";
import { EntityBroker } from "../broker/entity-broker.js";

export class FunctionSetup {
  private bopsEngine : BopsEngine;
  private bopsDependencyCheck = new Map<string, CheckBopsFunctionsDependencies>();

  // eslint-disable-next-line max-params
  public constructor (
    private systemBroker : EntityBroker,
    private functionsBroker : EntityBroker,
    private systemConfiguration : ConfigurationType,
  ) { }

  // eslint-disable-next-line max-lines-per-function
  public async setup () : Promise<void> {
    logger.operation(`[Function Setup] Starting bootstrap process for BOps functions in system "${
      this.systemConfiguration.name
    }"`);

    const allBopsDependencies : BopsDependencies[] = this.extractAllDependencies();
    this.checkInternalDependencies();
    this.checkSchemaDependencies();

    await this.bootstrapExternalDependencies(allBopsDependencies);
    this.bootstrapProtocols(allBopsDependencies);
    this.checkExternalDependencies();
    this.checkBopsInterDependencies();

    if (!process.argv.includes("--skip-prop-validation")) {
      const propValidator = new DependencyPropValidator(
        this.systemConfiguration,
        this.systemBroker,
      );
      propValidator.verifyAll();
    }

    const moduleManager = new ModuleManager(this.systemBroker);

    this.replaceGetSystemFunction(moduleManager, this.systemConfiguration);

    this.bopsEngine = new BopsEngine({
      ModuleManager: moduleManager,
      SystemConfig: this.systemConfiguration,
    });

    logger.operation("[Function Setup] Starting BOps build process");

    this.buildBops();
    logger.success("[Function Setup] Success - Function Setup complete");
  }

  private replaceGetSystemFunction (manager : ModuleManager, systemConfig : ConfigurationType) : void {
    const builtManager = manager.resolveSystemModules(systemConfig);

    this.systemBroker.internalFunctions.override("getSystemFunction", (
      input : { moduleName : string; modulePackage : string; moduleType : ModuleType },
    ) => {
      const name = input.modulePackage === undefined ?
        `${input.moduleType}.${input.moduleName}` :
        `${input.moduleType}.${input.modulePackage}.${input.moduleName}`;

      const callableFunction = builtManager.get(name as unknown as ModuleFullName);
      const found = callableFunction !== undefined;
      return { callableFunction, found };
    });
  }

  // eslint-disable-next-line max-lines-per-function
  private extractAllDependencies () : BopsDependencies[] {
    const result = [];

    const domainBops = this.systemConfiguration.businessOperations
      .map((bopsConfig) => new BusinessOperation(bopsConfig));

    this.systemConfiguration.businessOperations.forEach((bopsConfig) => {
      const dependencyCheck = new CheckBopsFunctionsDependencies(
        this.systemConfiguration.schemas,
        domainBops,
        new BusinessOperation(bopsConfig),
        this.externalFunctionManager,
        this.systemBroker,
        this.protocolFunctionManager,
      );

      this.bopsDependencyCheck.set(bopsConfig.name, dependencyCheck);

      result.push(dependencyCheck.bopsDependencies);
    });

    return result;
  }

  private checkInternalDependencies () : void {
    logger.operation("[Function Setup] Checking BOps internal dependencies");
    this.bopsDependencyCheck.forEach((depCheck) => {
      const result = depCheck.checkInternalFunctionsDependenciesMet();

      if (!result) {
        throw Error(`Unmet internal dependency found in BOp "${depCheck.bopsDependencies.bopName}"`);
      }
    });
  }

  private checkBopsInterDependencies () : void {
    logger.operation("[Function Setup] Checking for BOps inter dependency");
    this.bopsDependencyCheck.forEach((depCheck) => {
      const result = depCheck.checkBopsFunctionsDependenciesMet();

      if (!result) {
        throw Error(`Unmet BOp dependency found in BOp "${depCheck.bopsDependencies.bopName}" \n`
          + "Read logs above for more information",
        );
      }
    });
  }

  private checkExternalDependencies () : void {
    logger.operation("[Function Setup] Checking BOps external dependencies");
    this.bopsDependencyCheck.forEach((depCheck) => {
      const result = depCheck.checkExternalRequiredFunctionsMet();

      if (!result) {
        throw Error(`Unmet External dependency found in BOp "${depCheck.bopsDependencies.bopName}"`);
      }
    });
  }

  private checkSchemaDependencies () : void {
    this.bopsDependencyCheck.forEach((depCheck) => {
      const result = depCheck.checkSchemaFunctionsDependenciesMet();
      const schemaDeps = depCheck.bopsDependencies.fromSchemas.map(dep => dep.functionName).join(", ");
      const schemaDepsName = schemaDeps === "" ? "NO SCHEMA DEPENDENCIES" : schemaDeps;
      logger.operation(`[Function Setup] Checking schema function dependencies for BOp "${
        depCheck.bopsDependencies.bopName
      }": "${schemaDepsName}"`);

      if (!result) {
        throw Error(`Unmet Schema dependency found in BOp "${depCheck.bopsDependencies.bopName}"`);
      }
    });
  }

  // eslint-disable-next-line max-lines-per-function
  private async bootstrapExternalDependencies (allBopsDependencies : BopsDependencies[]) : Promise<void> {
    logger.operation("[Function Setup] Starting Bootstrap sequence for all system external dependencies");
    const externalDependenciesArray = allBopsDependencies
      .map((bopDependencies) => bopDependencies.external);

    const externalDependencies = externalDependenciesArray.reduce((previousValue, currentValue) => {
      const currentDependency = previousValue;
      currentValue.forEach((value) => currentDependency.push(value));

      return currentDependency;
    }, []);

    for (const dependency of externalDependencies) {
      await this.installFunction(dependency.name, dependency.version, dependency.package);
    }
  }

  // eslint-disable-next-line max-lines-per-function
  private bootstrapProtocols (allBopsDependencies : BopsDependencies[]) : void {
    logger.operation("[Function Setup] Starting Bootstrap sequence for all system protocols dependencies");
    const protocolsDependenciesArray = allBopsDependencies
      .map((bopDependencies) => bopDependencies.protocol);

    const protocolDependencies = protocolsDependenciesArray.reduce((previousValue, currentValue) => {
      const currentDependency = previousValue;
      currentValue.forEach((value) => currentDependency.push(value));

      return currentDependency;
    }, []);

    for (const dependency of protocolDependencies) {
      this.addProtocolFunction(dependency.name, dependency.package);
    }
  }

  private async installFunction (functionName : string, version : string, packageName ?: string) : Promise<void> {
    const exists = this.externalFunctionManager.functionIsInstalled(functionName, packageName);

    if (!exists) {
      await this.externalFunctionManager.add(functionName, version, packageName);
    }
  }

  // eslint-disable-next-line max-lines-per-function
  private buildBops (alreadyBuilt = 0) : void {
    const unbuiltBopsNames = this.systemConfiguration.businessOperations
      .map(bopConfig => bopConfig.name)
      .filter(bopName => !this.bopsManager.functionIsDeclared(bopName));

    if (unbuiltBopsNames.length === 0) {
      if(alreadyBuilt === 0) logger.warn("[BOps Build] No bops were built");

      logger.success(`[BOps Build] Finished building ${alreadyBuilt} bops.`);
      return;
    }

    logger.operation(`[BOps Build] Remaining BOps: [${unbuiltBopsNames.join(", ")}]`);

    const bopsWithMetDependencies = unbuiltBopsNames.filter((bopName) => {
      const bopsDependencies = this.bopsDependencyCheck.get(bopName).bopsDependencies;
      for (const bopDependencyFromBops of bopsDependencies.fromBops) {
        if (!this.bopsManager.functionIsDeclared(bopDependencyFromBops)) {
          return false;
        }
      }

      return true;
    });

    let bopsBuilt = 0;

    bopsWithMetDependencies.forEach((bopName) => {
      const currentBopConfig = this.systemConfiguration.businessOperations
        .find((bopConfig) => bopConfig.name === bopName);
      logger.operation(`[BOps Build] Stitching "${bopName}"`);

      this.bopsManager.add(
        bopName,
        this.bopsEngine.stitch(currentBopConfig, currentBopConfig.ttl ?? environment.constants.ttl),
      );
      bopsBuilt++;
    });

    this.buildBops(bopsBuilt);
  }
}
