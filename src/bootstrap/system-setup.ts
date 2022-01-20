import { externalFunctionManagerSingleton } from "../bops-functions/function-managers/external-function-manager";
import { FunctionManager } from "../bops-functions/function-managers/function-manager";
import internalFunctionManager from "../bops-functions/function-managers/internal-function-manager";
import { Configuration } from "../configuration/configuration";
import { DeserializeConfigurationCommand } from "../configuration/de-serialize-configuration";
import { FunctionSetup } from "../bootstrap/function-setup";
import { protocolFunctionManagerSingleton } from "../bops-functions/function-managers/protocol-function-manager";
import { ProtocolsSetup } from "./protocols-setup";
import { prettifyNPMPackageFile } from "../dependencies-management/package-file-helper";
import { environment } from "../common/execution-env";
import { logger } from "../common/logger/logger";

export class SystemSetup {
  private protocolsManager : ProtocolsSetup;

  // eslint-disable-next-line max-lines-per-function
  public async execute () : Promise<void> {
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

    logger.operation("[System Setup] Starting protocols");
    this.protocolsManager.startAllProtocols();
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

  private async deserializeConfiguration (validationContent : unknown) : Promise<Configuration> {
    const deserializer = new DeserializeConfigurationCommand();
    await deserializer.execute(validationContent);

    return deserializer.result;
  }

  private async getFileContents () : Promise<string> {
    logger.operation(`[System Setup] Searching system configuration in paths: "${environment.constants.configPath}"`);

    const content = await import(environment.constants.configPath as string);
    return content.default;
  }

  private async setupProtocols (
    systemFunctionsManager : FunctionManager, systemConfig : Configuration,
  ) : Promise<ProtocolsSetup> {
    const protocolsSetup = new ProtocolsSetup(systemConfig, protocolFunctionManagerSingleton, systemFunctionsManager);
    await protocolsSetup.execute();

    return protocolsSetup;
  };
}
