import Path from "path";
import FS from "fs";
import { externalFunctionManagerSingleton } from "src/bops-functions/function-managers/external-function-manager";
import { FunctionManager } from "src/bops-functions/function-managers/function-manager";
import internalFunctionManager from "src/bops-functions/function-managers/internal-function-manager";
import { Configuration } from "src/configuration/configuration";
import { DeserializeConfigurationCommand } from "src/configuration/de-serialize-configuration";
import { MetaProtocol } from "src/configuration/protocols/meta-protocol";
import { FunctionSetup } from "src/bootstrap/function-setup";
import { protocolClassesMap } from "src/bootstrap/protocol-classes";


const fsPromise = FS.promises;

export class SystemSetup {
  public async execute () : Promise<void> {
    console.log("[System Setup] System setup starting");
    console.log("[System Setup] Retrieving system configuration");
    const fileContent = await this.getFileContents();

    console.log("[System Setup] File found - Validating content");
    const systemConfig = this.desserializeConfiguration(fileContent);
    console.log("[System Setup] Validation successful");
    console.log("[System Setup] Starting System functions bootstrap sequence");
    const systemFunctions = await this.bootstrapFunctions(systemConfig);

    console.log("[System Setup] Done - Loading Protocols");
    await this.setupProtocols(systemFunctions, systemConfig);
  }

  private desserializeConfiguration (validationContent : string) : Configuration {
    const deserializer = new DeserializeConfigurationCommand();
    deserializer.execute(JSON.parse(validationContent));

    return deserializer.result;

  }

  private async getFileContents () : Promise<string> {
    const fileLocation = process.argv[2];

    const filePath = Path.join(process.env.PWD, fileLocation);
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
    systemConfig.protocols.forEach((protocolConfig) => {
      const NewableProtocol = protocolClassesMap[protocolConfig
        .protocolType] as unknown as new <T>(...args : unknown[]) => MetaProtocol<T>;

      const protocol = new NewableProtocol(protocolConfig.configuration, systemFunctionsManager);
      protocol.start();
    });
  };
}
