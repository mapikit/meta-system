import { externalFunctionManagerSingleton } from "../bops-functions/function-managers/external-function-manager";
import { FunctionManager } from "../bops-functions/function-managers/function-manager";
import internalFunctionManager from "../bops-functions/function-managers/internal-function-manager";
import { Configuration } from "../configuration/configuration";
import { DeserializeConfigurationCommand } from "../configuration/de-serialize-configuration";
import { FunctionSetup } from "../bootstrap/function-setup";
import chalk from "chalk";
import { protocolFunctionManagerSingleton } from "../bops-functions/function-managers/protocol-function-manager";
import { ProtocolsSetup } from "./protocols-setup";
import { prettifyNPMPackageFile } from "../dependencies-management/package-file-helper";
import { runtimeDefaults } from "../configuration/runtime-config/defaults";
import { environment } from "../common/execution-env";

export class SystemSetup {
  private protocolsManager : ProtocolsSetup;

  // eslint-disable-next-line max-lines-per-function
  public async execute () : Promise<void> {
    console.log(chalk.greenBright("[System Setup] System setup starting"));
    console.log("[System Setup] Retrieving system configuration");
    const fileContent = await this.getFileContents();

    console.log(chalk.greenBright("[System Setup] File found - Validating content"));
    const systemConfig = await this.deserializeConfiguration(fileContent);
    console.log(chalk.greenBright("[System Setup] Validation successful"));

    const functionSetupCommand = new FunctionSetup(
      internalFunctionManager,
      externalFunctionManagerSingleton,
      protocolFunctionManagerSingleton,
      systemConfig,
    );

    const systemFunctionsManager = functionSetupCommand.getBopsManager();

    console.log(chalk.greenBright("[Protocol Installation] Starting protocol installation"));
    this.protocolsManager = await this.setupProtocols(systemFunctionsManager, systemConfig);
    console.log(chalk.greenBright("[Protocol Installation] Protocol installation complete"));

    console.log("[System Setup] Starting System functions bootstrap sequence");
    await functionSetupCommand.setup();

    await prettifyNPMPackageFile(systemConfig.name, systemConfig.version,
      `${systemConfig.name} System - Made in Meta-System.`,
      runtimeDefaults.externalFunctionInstallFolder,
    );

    console.log("[System Setup] Starting protocols");
    this.protocolsManager.startAllProtocols();
  }

  public async stop () : Promise<void> {
    console.log(chalk.yellowBright("[System Shutdown] Shutting down system"));
    console.log("[System Shutdown] Stopping protocol(s)");

    await this.protocolsManager.stopAllProtocols();

    console.log(chalk.blueBright("[System Shutdown] System stopped gracefully"));
  }

  public restart () : void {
    console.log("Restarting System...");
    this.stop()
      .then(() => {
        this.execute()
          .catch(error => console.log(chalk.red("Error when attempting to start the system:", error)));
      })
      .catch(error => console.log(chalk.red("Error when attempting to stop the system:", error)));
  }

  private async deserializeConfiguration (validationContent : unknown) : Promise<Configuration> {
    const deserializer = new DeserializeConfigurationCommand();
    await deserializer.execute(validationContent);

    return deserializer.result;
  }

  private async getFileContents () : Promise<string> {
    console.log(`[System Setup] Searching system configuration in paths: "${environment.constants.configPath}"`);

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
