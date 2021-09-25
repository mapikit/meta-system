import Path from "path";
import FS from "fs";
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

const fsPromise = FS.promises;

export class SystemSetup {
  private protocolsManager : ProtocolsSetup;

  // eslint-disable-next-line max-lines-per-function
  public async execute () : Promise<void> {
    console.log(chalk.greenBright("[System Setup] System setup starting"));
    console.log("[System Setup] Retrieving system configuration");
    const fileContent = await this.getFileContents();

    console.log(chalk.greenBright("[System Setup] File found - Validating content"));
    const systemConfig = this.desserializeConfiguration(fileContent);
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

  private desserializeConfiguration (validationContent : string) : Configuration {
    const deserializer = new DeserializeConfigurationCommand();
    deserializer.execute(JSON.parse(validationContent));

    return deserializer.result;
  }

  private async getFileContents () : Promise<string> {
    const fileLocation = process.argv[2];

    const filePath = Path.join(process.cwd(), fileLocation);
    const absoluteFilePath = Path.join(fileLocation);

    console.log(`[System Setup] Searching system configuration in paths: "${filePath}" and "${absoluteFilePath}"`);

    const result = await fsPromise.readFile(filePath, "utf8")
      .catch(async () => {
        return fsPromise.readFile(absoluteFilePath, "utf8")
          .catch((error) => {
            console.error("COULD NOT READ SYSTEM CONFIGURATION IN ", filePath, " OR ", absoluteFilePath);

            throw error;
          });
      });

    return result;
  }

  private async setupProtocols (
    systemFunctionsManager : FunctionManager, systemConfig : Configuration,
  ) : Promise<ProtocolsSetup> {
    const protocolsSetup = new ProtocolsSetup(systemConfig, protocolFunctionManagerSingleton, systemFunctionsManager);
    await protocolsSetup.execute();

    return protocolsSetup;
  };
}
