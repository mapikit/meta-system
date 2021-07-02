import Path from "path";
import FS from "fs";
import { DeserializeConfigurationCommand } from "@api/configuration/de-serialize-configuration";
import { Configuration } from "@api/configuration/configuration";
import { FunctionSetup } from "@api/bootstrap/function/function-setup";
import { externalFunctionManagerSingleton } from "@api/bops-functions/function-managers/external-function-manager";
import internalFunctionManager from "@api/bops-functions/function-managers/internal-function-manager";
import { FunctionManager } from "@api/bops-functions/function-managers/function-manager";
import { protocolClassesMap } from "./protocol-classes";
import { MetaProtocol } from "@api/configuration/protocols/meta-protocol";

const fsPromise = FS.promises;

export class SystemSetup {
  public async execute () : Promise<void> {
    const fileContent = await this.getFileContents();
    const systemConfig = this.desserializeConfiguration(fileContent);

    const systemFunctions = await this.bootstrapFunctions(systemConfig);
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
