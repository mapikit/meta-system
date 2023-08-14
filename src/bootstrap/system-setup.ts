import { Configuration } from "../configuration/configuration.js";
import { DeserializeConfigurationCommand } from "../configuration/de-serialize-configuration.js";
import { FunctionSetup } from "../bootstrap/function-setup.js";
import { environment } from "../common/execution-env.js";
import { logger } from "../common/logger/logger.js";
import { importJsonAndParse } from "../common/helpers/import-json-and-parse.js";
import { SystemContext } from "../entities/system-context.js";
import { FunctionsContext } from "../entities/functions-context.js";
import { Collector } from "./collector.js";
import { ImportedInfo, Importer } from "./importer.js";

export class SystemSetup {
  public systemContext : SystemContext;
  public functionsContext : FunctionsContext;

  // eslint-disable-next-line max-lines-per-function
  public async execute () : Promise<void> {
    // Steps to Refactor -----
    // Get config
    // validate config
    // Create System Context

    logger.operation("[System Setup] System setup starting");
    logger.operation("[System Setup] Retrieving system configuration");
    const fileContent = await this.getFileContents();

    logger.success("[System Setup] File found - Validating content");
    const systemConfig = await this.deserializeConfiguration(fileContent);
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

    process.chdir(environment.constants.installDir);
  }

  public async stop () : Promise<void> {
    logger.warn("[System Shutdown] Shutting down system");
    logger.operation("[System Shutdown] Stopping protocol(s)");

    // This will ALSO be a Broker Action :)
    // await this.protocolsManager.stopAllProtocols();

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

  public async getFileContents () : Promise<object> {
    logger.operation(`[System Setup] Searching system configuration in paths: "${environment.constants.configPath}"`);

    return importJsonAndParse(environment.constants.configPath as string);
  }

  private async installAddons (systemConfig : Configuration) : Promise<Map<string, ImportedInfo>> {
    const collector = new Collector(systemConfig.addons, systemConfig);
    const metaFilesPaths = await collector.collectAddons();
    const imported = await Importer.importAddons(metaFilesPaths);
    return imported;
  }
}
