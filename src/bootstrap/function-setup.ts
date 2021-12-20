import { ProtocolFunctionManagerClass } from "../bops-functions/function-managers/protocol-function-manager";
import chalk from "chalk";
import { BopsEngine } from "../bops-functions/bops-engine/bops-engine";
import { ModuleFullName, ModuleManager } from "../bops-functions/bops-engine/modules-manager";
import { BopsManagerClass } from "../bops-functions/function-managers/bops-manager";
import { ExternalFunctionManagerClass } from "../bops-functions/function-managers/external-function-manager";
import { FunctionManager } from "../bops-functions/function-managers/function-manager";
import { InternalFunctionManagerClass } from "../bops-functions/function-managers/internal-function-manager";
import { BusinessOperation } from "../configuration/business-operations/business-operation";
import { BopsDependencies, CheckBopsFunctionsDependencies }
  from "../configuration/business-operations/check-bops-functions-dependencies";
import { ConfigurationType } from "../configuration/configuration-type";
import { SchemaType } from "../configuration/schemas/schemas-type";
import { SchemasManager } from "../schemas/application/schemas-manager";
import { ModuleType } from "../configuration/business-operations/business-operations-type";
import { DependencyPropValidator } from "./dependency-validator";

export class FunctionSetup {
  private readonly bopsManager = new BopsManagerClass();
  private bopsEngine : BopsEngine;
  private bopsDependencyCheck = new Map<string, CheckBopsFunctionsDependencies>();

  // eslint-disable-next-line max-params
  public constructor (
    private internalFunctionManager : InternalFunctionManagerClass,
    private externalFunctionManager : ExternalFunctionManagerClass,
    private protocolFunctionManager : ProtocolFunctionManagerClass,
    private systemConfiguration : ConfigurationType,
  ) { }

  // eslint-disable-next-line max-lines-per-function
  public async setup () : Promise<void> {
    console.log(`[Function Setup] Starting bootstrap process for BOps functions in system "${
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
        this.internalFunctionManager,
        this.externalFunctionManager,
        this.protocolFunctionManager,
      );
      propValidator.verifyAll();
    }

    const moduleManager = new ModuleManager({
      ExternalFunctionManager: this.externalFunctionManager,
      InternalFunctionManager: this.internalFunctionManager,
      protocolFunctionManager: this.protocolFunctionManager,
      BopsManager: this.bopsManager,
      SchemasManager: await this.createSchemasManager(this.systemConfiguration.schemas),
    });

    this.replaceGetSystemFunction(moduleManager, this.systemConfiguration);

    this.bopsEngine = new BopsEngine({
      ModuleManager: moduleManager,
      SystemConfig: this.systemConfiguration,
    });

    console.log("[Function Setup] Starting BOps build process");

    this.buildBops();
    console.log(chalk.greenBright("[Function Setup] Success - Function Setup complete"));
  }

  private replaceGetSystemFunction (manager : ModuleManager, systemConfig : ConfigurationType) : void {
    const builtManager = manager.resolveSystemModules(systemConfig);

    this.internalFunctionManager.replace("getSystemFunction", (
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
        this.internalFunctionManager,
        this.protocolFunctionManager,
      );

      this.bopsDependencyCheck.set(bopsConfig.name, dependencyCheck);

      result.push(dependencyCheck.bopsDependencies);
    });

    return result;
  }

  private checkInternalDependencies () : void {
    console.log("[Function Setup] Checking BOps internal dependencies");
    this.bopsDependencyCheck.forEach((depCheck) => {
      const result = depCheck.checkInternalFunctionsDependenciesMet();

      if (!result) {
        throw Error(`Unmet internal dependency found in BOp "${depCheck.bopsDependencies.bopName}"`);
      }
    });
  }

  private checkBopsInterDependencies () : void {
    console.log("[Function Setup] Checking for BOps inter dependency");
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
    console.log("[Function Setup] Checking BOps external dependencies");
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
      const schemaDeps =  depCheck.bopsDependencies.fromSchemas.join(", ");
      const schemaDepsName = schemaDeps === "" ? "NO SCHEMA DEPENDENCIES" : schemaDeps;

      console.log(`[Function Setup] Checking schema function dependencies for BOp "${
        depCheck.bopsDependencies.bopName
      }": "${schemaDepsName}"`);

      if (!result) {
        throw Error(`Unmet Schema dependency found in BOp "${depCheck.bopsDependencies.bopName}"`);
      }
    });
  }

  // eslint-disable-next-line max-lines-per-function
  private async bootstrapExternalDependencies (allBopsDependencies : BopsDependencies[]) : Promise<void> {
    console.log("[Function Setup] Starting Bootstrap sequence for all system external dependencies");
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
    console.log("[Function Setup] Starting Bootstrap sequence for all system protocols dependencies");
    const protocolsDependenciesArray = allBopsDependencies
      .map((bopDependencies) => bopDependencies.protocol);

    const protocolDependencies = protocolsDependenciesArray.reduce((previousValue, currentValue) => {
      const currentDependency = previousValue;
      currentValue.forEach((value) => currentDependency.push(value));

      return currentDependency;
    }, []);

    for (const dependency of protocolDependencies) {
      this.addProtocolFunction(dependency.name, dependency.version, dependency.package);
    }
  }

  private addProtocolFunction (functionName : string, version : string, packageName : string) : void {
    // Protocols are installed before this whole class is created, so here we just add the functions of already
    // existing instances of protocols.
    const exists = this.protocolFunctionManager.get(`${packageName}.${functionName}`);

    if (!exists) {
      this.protocolFunctionManager.addFunction(functionName, packageName);
    }
  }

  private async installFunction (functionName : string, version : string, packageName ?: string) : Promise<void> {
    const exists = this.externalFunctionManager.functionIsInstalled(functionName, packageName);

    if (!exists) {
      await this.externalFunctionManager.add(functionName, version, packageName);
    }
  }

  // eslint-disable-next-line max-lines-per-function
  private async createSchemasManager (systemSchemas : SchemaType[]) : Promise<SchemasManager> {
    const manager = new SchemasManager(
      this.systemConfiguration.name,
      this.protocolFunctionManager,
    );

    const schemasNames = systemSchemas.map((schemaType) => schemaType.name).join(", ");
    console.log(`[Schemas Setup] Adding schemas to the system: "${schemasNames}"`);

    await manager.addSystemSchemas(systemSchemas);

    return manager;
  }

  // eslint-disable-next-line max-lines-per-function
  private buildBops () : void {
    const unbuiltBopsNames = this.systemConfiguration.businessOperations.map((bopConfig) => {
      return bopConfig.name;
    }).filter((bopName) => !this.bopsManager.functionIsDeclared(bopName));

    if (unbuiltBopsNames.length === 0) {
      console.log(chalk.greenBright("[BOps Build] All BOps are built"));
      return;
    }

    console.log(`[BOps Build] Remaining BOps: [${unbuiltBopsNames.join(", ")}]`);

    const bopsWithMetDependencies = unbuiltBopsNames.filter((bopName) => {
      const bopsDependencies = this.bopsDependencyCheck.get(bopName).bopsDependencies;
      for (const bopDependencyFromBops of bopsDependencies.fromBops) {
        if (!this.bopsManager.functionIsDeclared(bopDependencyFromBops)) {
          return false;
        }
      }

      return true;
    });

    bopsWithMetDependencies.forEach((bopName) => {
      const currentBopConfig = this.systemConfiguration.businessOperations
        .find((bopConfig) => bopConfig.name === bopName);
      console.log(`[BOps Build] Stitching "${bopName}"`);

      this.bopsManager.add(
        bopName,
        this.bopsEngine.stitch(currentBopConfig),
      );
    });

    this.buildBops();
  }

  public getBopsManager () : FunctionManager {
    return this.bopsManager;
  }
}
