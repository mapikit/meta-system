// Controls file and dependency structure for Meta Protocols.
import FS from "fs";
import { FunctionManager } from "meta-function-helper";
import { MetaProtocol } from "meta-protocol-helper/dist/src/meta-protocol";
import Path from "path";
const fsPromise = FS.promises;

export class ProtocolFileSystem {
  private readonly installLocation : string;
  private readonly configurationFileName : string;

  public constructor (
    customFunctionsLocation : string,
    configurationFileName : string,
  ) {
    this.installLocation = customFunctionsLocation;
    this.configurationFileName = configurationFileName;
  }

  /**
   * Finds and retrieve the configuration file for a given moduleName
   * @param moduleName
   */
  public async getDescriptionFile (moduleName : string) : Promise<string> {
    const filePath = Path.join(this.installLocation, "node_modules", moduleName, this.configurationFileName);

    console.log(`[Meta Protocols] Retrieving Description File for ${moduleName}`);

    const file = fsPromise.readFile(filePath, "utf8")
      .then((result) => {
        console.log(`[Meta Protocols] Success - Retrieved Description File for ${moduleName}`);

        return result;
      });

    return file;
  }

  public async importClass (
    moduleName : string, entrypoint : string, className : string)
    : Promise<new (arg1 : unknown, arg2 : FunctionManager) => MetaProtocol<unknown>> {
    const filePath = Path.join(this.installLocation, "node_modules", moduleName, entrypoint);
    console.log(`[Meta Protocols] Retrieving class for ${moduleName}`);

    const importedEntrypoint = await import(filePath);

    const metaProtocolClass = importedEntrypoint[className];

    return metaProtocolClass;
  }
}
