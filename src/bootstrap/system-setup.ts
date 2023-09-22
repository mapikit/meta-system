import { Configuration } from "../configuration/configuration.js";
import { DeserializeConfigurationCommand } from "../configuration/de-serialize-configuration.js";
import { FunctionSetup } from "../bootstrap/function-setup.js";
import { logger } from "../common/logger/logger.js";
import { SystemContext } from "../entities/system-context.js";
import { FunctionsContext } from "../entities/functions-context.js";
import { Collector, ImportedType } from "./collector.js";
import { LogLevelsType } from "common/logger/logger-types.js";

type SetupOptions = {
  logLevel : LogLevelsType
}

export class SystemSetup {
  public systemContext : SystemContext;
  public functionsContext : FunctionsContext;

  constructor (private rawSystemConfig : unknown, private options ?: SetupOptions) {
    console.log("constructed system setup");
  }

  // eslint-disable-next-line max-lines-per-function
  public async execute () : Promise<void> {
    // Steps to Refactor -----
    // Get config
    // validate config
    // Create System Context
    // Check Platform

    if(this.options !== undefined) {
      if(this.options.logLevel) await logger.initialize(this.options.logLevel);
    }

    const systemConfig = await this.deserializeConfiguration(this.rawSystemConfig);
    logger.success("[System Setup] Validation successful");

    this.systemContext = new SystemContext(systemConfig);
    this.functionsContext = new FunctionsContext();

    logger.operation("[Add-ons Installation] Starting add-ons installation");
    const addons = await this.installAddons(systemConfig);
    logger.success("[Add-ons Installation] Add-ons installation complete");

    const functionSetupCommand = new FunctionSetup(
      this.systemContext,
      this.functionsContext,
      addons,
      systemConfig,
    );

    logger.operation("[System Setup] Starting System functions bootstrap sequence");
    await functionSetupCommand.setup();
  }

  public async stop () : Promise<void> {
    logger.warn("[System Shutdown] Shutting down system");
    logger.operation("[System Shutdown] Stopping protocol(s)");

    // TODO: This will ALSO be a Broker Action :)

    logger.success("[System Shutdown] System stopped gracefully");
  }

  public restart () : void {
    logger.operation("Restarting System...");
    this.stop()
      .then(() => {
        this.execute()
          .catch(error => logger.fatal("Error when attempting to start the system:", error));
      })
      .catch(error => logger.fatal("Error when attempting to stop the system:", error));
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

  private async deserializeConfiguration (validationContent : unknown) : Promise<Configuration> {
    const deserializer = new DeserializeConfigurationCommand();
    await deserializer.execute(validationContent);
    return deserializer.result;
  }

  private async installAddons (systemConfig : Configuration) : Promise<ImportedType> {
    const env = (typeof process === "object") ? "node" : "browser";
    const collector = new Collector({ runtimeEnv: env }, systemConfig);
    const imported = await collector.collectAddons();
    return imported;
  }
}
