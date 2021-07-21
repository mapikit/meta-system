import Path from "path";
import FS from "fs";
import { externalFunctionManagerSingleton } from "../bops-functions/function-managers/external-function-manager";
import { FunctionManager } from "../bops-functions/function-managers/function-manager";
import internalFunctionManager from "../bops-functions/function-managers/internal-function-manager";
import { Configuration } from "../configuration/configuration";
import { DeserializeConfigurationCommand } from "../configuration/de-serialize-configuration";
import { MetaProtocol } from "../configuration/protocols/meta-protocol";
import { FunctionSetup } from "../bootstrap/function-setup";
import { protocolClassesMap } from "../bootstrap/protocol-classes";
import chalk from "chalk";

const fsPromise = FS.promises;

export class SystemSetup {
  private runningProtocols : MetaProtocol<unknown>[] = [];
  public async execute () : Promise<void> {
    console.log(chalk.greenBright("[System Setup] System setup starting"));
    console.log("[System Setup] Retrieving system configuration");
    const fileContent = await this.getFileContents();

    console.log(chalk.greenBright("[System Setup] File found - Validating content"));
    const systemConfig = this.desserializeConfiguration(fileContent);
    console.log(chalk.greenBright("[System Setup] Validation successful"));
    console.log("[System Setup] Starting System functions bootstrap sequence");
    const systemFunctions = await this.bootstrapFunctions(systemConfig);

    console.log(chalk.greenBright("[System Setup] Done - Loading Protocols"));
    await this.setupProtocols(systemFunctions, systemConfig);
    console.log(chalk.greenBright("[System Setup] Setup Done"));
  }

  public async stop () : Promise<void> {
    console.log(chalk.yellowBright("[System Shutdown] Shutting down system"));
    console.log("[System Shutdown] Stopping", this.runningProtocols.length, "protocol(s)");
    for(const protocol of this.runningProtocols) {
      await protocol.stop();
    }
    this.runningProtocols = [];
    console.log(chalk.blueBright("[System Shutdown] System stopped gracefully"));
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

  private async bootstrapFunctions (systemConfig : Configuration) : Promise<FunctionManager> {
    const functionSetup = new FunctionSetup(
      internalFunctionManager,
      externalFunctionManagerSingleton,
      systemConfig,
    );

    await functionSetup.setup();

    return functionSetup.getBopsManager();
  }

  private async setupProtocols (
    systemFunctionsManager : FunctionManager, systemConfig : Configuration,
  ) : Promise<void> {
    for (const protocolConfig of systemConfig.protocols) {
      const NewableProtocol = protocolClassesMap[protocolConfig
        .protocolType] as unknown as new <T>(...args : unknown[]) => MetaProtocol<T>;

      const protocol = new NewableProtocol(protocolConfig.configuration, systemFunctionsManager);
      await protocol.start();
      this.runningProtocols.push(protocol);
    };
  };
}
