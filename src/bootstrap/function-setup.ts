import { BopsEngine } from "../bops-functions/bops-engine/bops-engine.js";
import { ModuleManager } from "../bops-functions/bops-engine/modules-manager.js";
import { BopsDependencies, CheckBopsFunctionsDependencies }
  from "../configuration/business-operations/check-bops-functions-dependencies.js";
import { ConfigurationType } from "../configuration/configuration-type.js";
import { BopsConfigurationEntry } from "../configuration/business-operations/business-operations-type.js";
import { logger } from "../common/logger/logger.js";
import { environment } from "../common/execution-env.js";
import { BrokerFactory, EntityBroker } from "../broker/entity-broker.js";
import { FunctionsContext } from "../entities/functions-context.js";
import { ImportedInfo } from "./importer.js";
import { SystemContext } from "../entities/system-context.js";

export class FunctionSetup {
  private bopsEngine : BopsEngine;
  private bopsDependencyCheck = new Map<string, CheckBopsFunctionsDependencies>();
  private addonBrokers = new Map<string, EntityBroker>();
  private addonsConfigurationData = new Map<string, unknown>();

  // eslint-disable-next-line max-params
  public constructor (
    private systemContext : SystemContext,
    private functionsContext : FunctionsContext,
    private importedAddons : Map<string, ImportedInfo>,
    private systemConfiguration : ConfigurationType,
  ) { }

  // eslint-disable-next-line max-lines-per-function
  public async setup () : Promise<void> {
    logger.operation(`[Function Setup] Starting bootstrap process for BOps functions in system "${
      this.systemConfiguration.name
    }"`);

    this.checkInternalDependencies();

    this.checkBopsInterDependencies();


    await this.configureAddons();

    const moduleManager = new ModuleManager(this.functionsContext.systemBroker);
    const allBopsDependencies : BopsDependencies[] = this.extractAllDependencies();

    // this.replaceGetSystemFunction(moduleManager, this.systemConfiguration);

    this.bopsEngine = new BopsEngine({
      ModuleManager: moduleManager,
      SystemConfig: this.systemConfiguration,
    });

    logger.operation("[Function Setup] Starting BOps build process");

    this.buildBops();

    // TODO Reimplement prop validation
    // if (!process.argv.includes("--skip-prop-validation")) {
    //   const propValidator = new DependencyPropValidator(
    //     this.systemConfiguration,
    //     this.systemBroker,
    //   );
    //   propValidator.verifyAll();
    // }

    await this.bootAddons();

    this.functionsContext.systemBroker.done();
    logger.success("[Function Setup] Success - Function Setup complete");
  }

  private async configureAddons () : Promise<void> {
    for(const addonInfo of this.importedAddons) {
      const [identifier, addon] = addonInfo;
      logger.operation("[Function Setup] Starting configure for addon", identifier);
      const addonConfigure = this.functionsContext.createBroker(addon.metaFile.permissions ?? [], identifier);
      const addonBoot = this.systemContext.createBroker(addon.metaFile.permissions ?? [], identifier);
      const addonBroker = BrokerFactory.joinBrokers(addonConfigure, addonBoot);
      this.addonBrokers.set(identifier, addonBroker);
      const addonUserConfig = this.systemConfiguration.addons
        .find((addonConfig) => addonConfig.identifier === identifier);

      this.addonsConfigurationData.set(identifier, await addon.main.configure(addonConfigure, addonUserConfig));
    };
  }

  private async bootAddons () : Promise<void> {
    for(const addonInfo of this.importedAddons) {
      const [identifier, addon] = addonInfo;
      logger.operation("[Function Setup] Booting addon", identifier);
      const addonBroker = this.addonBrokers.get(identifier);
      await addon.main.boot(addonBroker, this.addonsConfigurationData.get(identifier));
      addonBroker.done();
    };
  }

  // eslint-disable-next-line max-lines-per-function
  private extractAllDependencies () : BopsDependencies[] {
    const result = [];

    // const domainBops = this.systemConfiguration.businessOperations
    //   .map((bopsConfig) => new BusinessOperation(bopsConfig));

    this.systemConfiguration.businessOperations.forEach((bopsConfig) => {
      const dependencyCheck = new CheckBopsFunctionsDependencies(
        this.systemContext.systemBroker,
        this.functionsContext.systemBroker,
        bopsConfig.identifier,
      );

      dependencyCheck.checkAllDependencies();

      this.bopsDependencyCheck.set(bopsConfig.identifier, dependencyCheck);

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
  private buildBops (alreadyBuilt = 0) : void {
    const unbuiltBopsIds = this.systemConfiguration.businessOperations
      .map(bopConfig => bopConfig.identifier)
      .filter((bopId) => !this.bopFunctionIsDeclared(bopId));
    if (unbuiltBopsIds.length === 0) {
      if(alreadyBuilt === 0) logger.warn("[BOps Build] No bops were built");

      logger.success(`[BOps Build] Finished building ${alreadyBuilt} bops.`);
      return;
    }

    logger.operation(`[BOps Build] Remaining BOps: [${unbuiltBopsIds.join(", ")}]`);

    const bopsWithMetDependencies = unbuiltBopsIds.filter((bopId) => {
      const currentBop = this.systemConfiguration.businessOperations.find(bop => bop.identifier === bopId);
      const bopsDependencies = this.getBopDependencies(currentBop.configuration);

      for (const bopDependencyFromBops of bopsDependencies) {
        if (!this.bopFunctionIsDeclared(bopDependencyFromBops)) {
          return false;
        }
      }

      return true;
    });

    let bopsBuilt = 0;

    bopsWithMetDependencies.forEach((bopId) => {
      const currentBopConfig = this.systemConfiguration.businessOperations
        .find((bopConfig) => bopConfig.identifier === bopId);
      logger.operation(`[BOps Build] Stitching "${bopId}"`);

      const definition = {
        input: currentBopConfig.input,
        output: currentBopConfig.output,
      };
      const callable = this.bopsEngine.stitch(currentBopConfig, currentBopConfig.ttl ?? environment.constants.ttl);
      this.functionsContext.systemBroker.bopFunctions.addBopCall(bopId, callable, definition);
      bopsBuilt++;
    });

    this.buildBops(bopsBuilt);
  }


  private bopFunctionIsDeclared (functionName : string) : boolean {
    return this.functionsContext.systemBroker["bopFunctions"].getBopFunction(functionName) !== undefined;
  }

  private getBopDependencies (bopConfig : BopsConfigurationEntry[]) : string[] {
    return bopConfig
      .filter(config => config.moduleType === "bop")
      .map(config => config.moduleName);
  }
}
