import { externalFunctionManagerSingleton } from "../bops-functions/function-managers/external-function-manager.js";
import { FunctionManager } from "../bops-functions/function-managers/function-manager.js";
import internalFunctionManager from "../bops-functions/function-managers/internal-function-manager.js";
import { Configuration } from "../configuration/configuration.js";
import { DeserializeConfigurationCommand } from "../configuration/de-serialize-configuration.js";
import { FunctionSetup } from "../bootstrap/function-setup.js";
import { protocolFunctionManagerSingleton } from "../bops-functions/function-managers/protocol-function-manager.js";
import { ProtocolsSetup } from "./protocols-setup.js";
import { prettifyNPMPackageFile } from "../dependencies-management/package-file-helper.js";
import { environment } from "../common/execution-env.js";
import { logger } from "../common/logger/logger.js";
import { importJsonAndParse } from "../common/helpers/import-json-and-parse.js";

export class SystemSetup {
  private protocolsManager : ProtocolsSetup;

  // eslint-disable-next-line max-lines-per-function
  public async execute () : Promise<FunctionManager> {
    logger.operation("[System Setup] System setup starting");
    logger.operation("[System Setup] Retrieving system configuration");
    const fileContent = await this.getFileContents();

    logger.success("[System Setup] File found - Validating content");
    const systemConfig = await this.deserializeConfiguration(fileContent);
    logger.success("[System Setup] Validation successful");

    const functionSetupCommand = new FunctionSetup(
      internalFunctionManager,
      externalFunctionManagerSingleton,
      protocolFunctionManagerSingleton,
      systemConfig,
    );

    const systemFunctionsManager = functionSetupCommand.getBopsManager();

    logger.operation("[Protocol Installation] Starting protocol installation");
    this.protocolsManager = await this.setupProtocols(systemFunctionsManager, systemConfig);
    logger.success("[Protocol Installation] Protocol installation complete");

    logger.operation("[System Setup] Starting System functions bootstrap sequence");
    await functionSetupCommand.setup();

    await prettifyNPMPackageFile(systemConfig.name, systemConfig.version,
      `${systemConfig.name} System - Made in Meta-System.`,
      environment.constants.installDir,
    );
    process.chdir(environment.constants.installDir);

    logger.operation("[System Setup] Starting protocols");
    this.protocolsManager.startAllProtocols();
    return systemFunctionsManager;
  }

  public async stop () : Promise<void> {
    logger.warn("[System Shutdown] Shutting down system");
    logger.operation("[System Shutdown] Stopping protocol(s)");

    await this.protocolsManager.stopAllProtocols();

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

    const functionsManager = await this.execute();


    const requiredFunction = functionsManager.get(bopName);
    if(requiredFunction === undefined) {
      logger.error("Function to test does not exist");
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

  private async setupProtocols (
    systemFunctionsManager : FunctionManager, systemConfig : Configuration,
  ) : Promise<ProtocolsSetup> {
    const protocolsSetup = new ProtocolsSetup(systemConfig, protocolFunctionManagerSingleton, systemFunctionsManager);
    await protocolsSetup.execute();

    return protocolsSetup;
  };
}
