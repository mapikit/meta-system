import { Configuration } from "../configuration/configuration.js";
import { DeserializeConfigurationCommand } from "../configuration/de-serialize-configuration.js";
import { logger } from "../common/logger/logger.js";
import { SystemContext } from "../entities/system-context.js";
import { FunctionsContext } from "../entities/functions-context.js";
import { Collector, ImportedType } from "./collector.js";
import { LogLevelsType } from "../common/logger/logger-types.js";
import { loadInternalFunctions } from "../bops-functions/internal-functions-loader.js";
import { BopsDependencies, CheckBopsFunctionsDependencies }
  from "../configuration/business-operations/check-bops-functions-dependencies.js";
import { ModuleManager } from "../bops-functions/bops-engine/modules-manager.js";
import { BopsEngine } from "../bops-functions/bops-engine/bops-engine.js";
import { BrokerFactory, EntityBroker } from "../broker/entity-broker.js";
import { validateObject } from "@meta-system/object-definition";
import { BopsConfigurationEntry } from "../configuration/business-operations/business-operations-type.js";
import { environment } from "../common/execution-env.js";
import { DiffManager } from "../configuration/diff/diff-manager.js";
import constants from "../common/constants.js";

type SetupOptions = {
  logLevel : LogLevelsType
}

/**
  *  Class responsible for booting up Meta-System from a configuration data
  * */
export class SystemSetup {
  public systemContext : SystemContext;
  public functionsContext : FunctionsContext;
  public diffManager : DiffManager = new DiffManager();
  private systemConfig : Configuration;
  private systemAddons : ImportedType;
  private bopsDependencyCheck = new Map<string, CheckBopsFunctionsDependencies>();
  private moduleManager : ModuleManager;
  private bopsEngine : BopsEngine;
  private addonBrokers = new Map<string, EntityBroker>();
  private addonsConfigurationData = new Map<string, unknown>();
  public systemIdentifier = constants.RUNTIME_ENGINE_IDENTIFIER;

  constructor (private rawSystemConfig : unknown, private options ?: SetupOptions) {}

  // eslint-disable-next-line max-lines-per-function
  public async execute () : Promise<void> {
    await this.prepare();

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
    this.bopsEngine.refreshFunctionMapping();
    logger.success("[Function Setup] Success - Function Setup complete");
  }

  // eslint-disable-next-line max-lines-per-function
  public async prepare () : Promise<void> {
    if(this.options !== undefined) {
      if(this.options.logLevel) await logger.initialize(this.options.logLevel);
    }

    await this.deserializeConfiguration(this.rawSystemConfig);
    logger.success("[System Setup] Validation successful");

    this.initializeConxtexts();
    logger.success("[System Setup] Initialized Contexts");

    logger.operation("[Add-ons Installation] Starting add-ons installation");
    await this.installAddons(this.systemConfig);
    logger.success("[Add-ons Installation] Add-ons installation complete");

    logger.operation(`[System Setup] Starting bootstrap process for bops functions in system "${
      this.systemConfig.name
    }"`);
    loadInternalFunctions(this.functionsContext.systemBroker);
    await this.configureAddons();
    this.extractAllDependencies();
    this.checkInternalDependencies();
    this.checkBopsInterDependencies();
    this.checkSchemaFunctionsDependencies();

    this.createManager();
    this.createBopsEngine();

    logger.operation("[System Setup] Starting BOps build process");

    this.buildBops();
  }

  public async testBop (bopName : string, stringInput : string) : Promise<void> {
    logger.operation("Testing bop", bopName, "with", stringInput);

    await this.execute();

    const requiredFunction = this.functionsContext.systemBroker.bopFunctions.getBopFunction(bopName);
    if(requiredFunction === undefined) {
      const functions = this.functionsContext.systemBroker.bopFunctions.getAll();
      logger.error("Function to test does not exist. Available:", functions.map(funct => funct.identifier).join(", "));
      return;
    }

    try {
      const parsedInput = stringInput !== undefined ? JSON.parse(stringInput) : {};
      await requiredFunction(parsedInput);
    } catch (error) { throw error; }
  }

  private async deserializeConfiguration (validationContent : unknown) : Promise<void> {
    const deserializer = new DeserializeConfigurationCommand();
    await deserializer.execute(validationContent);
    this.systemConfig = deserializer.result;
  }

  private async installAddons (systemConfig : Configuration) : Promise<void> {
    const runtimeEnv = (typeof process === "object") ? "node" : "browser";
    const collector = new Collector({ runtimeEnv }, systemConfig);
    this.systemAddons = await collector.collectAddons();
  }

  private initializeConxtexts () : void {
    this.systemContext = new SystemContext(this.systemConfig, this.diffManager);
    this.functionsContext = new FunctionsContext(this.diffManager);
  }

  private checkSchemaFunctionsDependencies () : void {
    logger.operation("[System Setup] Checking BOps internal dependencies");
    this.bopsDependencyCheck.forEach((depCheck) => {
      const result = depCheck.checkSchemaFunctionsDependenciesMet();

      if (!result) {
        throw Error(`Unmet schemaFunction dependency found in BOp "${depCheck.bopsDependencies.bopName}"`);
      }
    }) ;
  }

  private checkInternalDependencies () : void {
    logger.operation("[System Setup] Checking BOps internal dependencies");
    this.bopsDependencyCheck.forEach((depCheck) => {
      const result = depCheck.checkInternalFunctionsDependenciesMet();

      if (!result) {
        throw Error(`Unmet internal dependency found in BOp "${depCheck.bopsDependencies.bopName}"`);
      }
    });
  }

  private checkBopsInterDependencies () : void {
    logger.operation("[System Setup] Checking for BOps inter dependency");
    this.bopsDependencyCheck.forEach((depCheck) => {
      const result = depCheck.checkBopsFunctionsDependenciesMet();

      if (!result) {
        throw Error(`Unmet BOp dependency found in BOp "${depCheck.bopsDependencies.bopName}" \n`
          + "Read logs above for more information",
        );
      }
    });
  }

  private createManager () : void {
    this.moduleManager = new ModuleManager(this.functionsContext.systemBroker);
  }

  private createBopsEngine () : void {
    this.bopsEngine = new BopsEngine({
      ModuleManager: this.moduleManager,
      SystemConfig: this.systemConfig,
    });
  }

  // eslint-disable-next-line max-lines-per-function
  private async configureAddons () : Promise<void> {
    for(const addonInfo of this.systemAddons) {
      const [identifier, addon] = addonInfo;
      logger.operation("[Function Setup] Starting configure for addon", identifier);
      const functionsBroker = this.functionsContext.createBroker(addon.metaFile.permissions ?? [], identifier);
      const systemBroker = this.systemContext.createBroker(addon.metaFile.permissions ?? [], identifier);
      const addonBroker = BrokerFactory.joinBrokers(functionsBroker, systemBroker);
      this.addonBrokers.set(identifier, addonBroker);
      const addonUserConfig = this.systemConfig.addons
        .find((addonConfig) => addonConfig.identifier === identifier)
        .configuration;

      const userConfigurationValidation = validateObject(addonUserConfig, addon.metaFile.configurationFormat ?? {});

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
        this.diffManager.addCheckpoint(identifier);
      } catch (error) {
        throw Error(`Addon ${identifier} 'configure' function has failed.\n` + error);
      }

      if (!done) {
        // eslint-disable-next-line max-len
        logger.fatal("Addon ", identifier, " 'configure' function executed, but broker did not receive the `done()` signal.",
          " - Aborting launch!");

        throw Error("Addon configure entrypoint did not call done().");
      }
    };
  }

  private bopFunctionIsDeclared (functionName : string) : boolean {
    return this.functionsContext.systemBroker["bopFunctions"].getBopFunction(functionName) !== undefined;
  }

  private getBopDependencies (bopConfig : BopsConfigurationEntry[]) : string[] {
    return bopConfig
      .filter(config => config.moduleType === "bop")
      .map(config => config.moduleName);
  }

  // eslint-disable-next-line max-lines-per-function
  private buildBops (alreadyBuilt = 0) : void {
    const unbuiltBopsIds = this.systemConfig.businessOperations
      .map(bopConfig => bopConfig.identifier)
      .filter((bopId) => !this.bopFunctionIsDeclared(bopId));
    if (unbuiltBopsIds.length === 0) {
      if(alreadyBuilt === 0) logger.warn("[BOps Build] No bops were built");

      logger.success(`[BOps Build] Finished building ${alreadyBuilt} bops.`);
      return;
    }

    logger.operation(`[BOps Build] Remaining BOps: [${unbuiltBopsIds.join(", ")}]`);

    const bopsWithMetDependencies = unbuiltBopsIds.filter((bopId) => {
      const currentBop = this.systemConfig.businessOperations.find(bop => bop.identifier === bopId);
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
      const currentBopConfig = this.systemConfig.businessOperations
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

  private async bootAddons () : Promise<void> {
    for(const addonInfo of this.systemAddons) {
      const [identifier, addon] = addonInfo;
      logger.operation("[Function Setup] Booting addon", identifier);
      const addonBroker = this.addonBrokers.get(identifier);
      await addon.main.boot(addonBroker, this.addonsConfigurationData.get(identifier));
      addonBroker.done();
    };
  }

  private extractAllDependencies () : BopsDependencies[] {
    const result = [];

    this.systemConfig.businessOperations.forEach((bopsConfig) => {
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
}

