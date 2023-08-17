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
import { validateObject } from "@meta-system/object-definition";
import { loadInternalFunctions } from "../bops-functions/internal-functions-loader.js";

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

    loadInternalFunctions(this.functionsContext.systemBroker);
    this.checkInternalDependencies();
    this.checkBopsInterDependencies();


    await this.configureAddons();

    const moduleManager = new ModuleManager(this.functionsContext.systemBroker);
    const allBopsDependencies : BopsDependencies[] = this.extractAllDependencies();

    // TODO Redo the function below - "getSystemFunction" from the internal functions.
    // this.replaceGetSystemFunction(moduleManager, this.systemConfiguration);

    this.bopsEngine = new BopsEngine({
      ModuleManager: moduleManager,
      SystemConfig: this.systemConfiguration,
    });

    logger.operation("[Function Setup] Starting BOps build process");

    this.buildBops();

    // TODO Reimplement prop validation - later re-release on v0.4.something
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

  // eslint-disable-next-line max-lines-per-function
  private async configureAddons () : Promise<void> {
    for(const addonInfo of this.importedAddons) {
      const [identifier, addon] = addonInfo;
      logger.operation("[Function Setup] Starting configure for addon", identifier);
      const functionsBroker = this.functionsContext.createBroker(addon.metaFile.permissions ?? [], identifier);
      const systemBroker = this.systemContext.createBroker(addon.metaFile.permissions ?? [], identifier);
      const addonBroker = BrokerFactory.joinBrokers(functionsBroker, systemBroker);
      this.addonBrokers.set(identifier, addonBroker);
      const addonUserConfig = this.systemConfiguration.addons
        .find((addonConfig) => addonConfig.identifier === identifier)
        .configuration;

      const userConfigurationValidation = validateObject(addonUserConfig, addon.metaFile.configurationFormat);

      if (userConfigurationValidation.errors.length > 0) {
        const message = "User configuration for addon " +  identifier + " is not valid!";
        logger.fatal(message);
        userConfigurationValidation.errors.forEach((validationError) => {
          logger.error(validationError.error, " at ", validationError.path);
        });

        throw Error(message);
      }

      let done = false;
      BrokerFactory.wrapBrokerDone(addonBroker, () => { done = true; });
      try {
        const addonConfigureResult = await addon.main.configure(addonBroker, addonUserConfig);
        this.addonsConfigurationData.set(identifier, addonConfigureResult);
      } catch {
        throw Error(`Addon ${identifier} 'configure' function has failed.`);
      }

      if (!done) {
        // eslint-disable-next-line max-len
        logger.fatal("Addon ", identifier, " 'configure' function executed, but broker did not receive the `done()` signal.",
          " - Aborting launch!");

        throw Error("Addon configure entrypoint did not call done().");
      }
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
