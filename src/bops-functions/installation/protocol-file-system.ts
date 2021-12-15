// Controls file and dependency structure for Meta Protocols.
import FS from "fs";
import { FunctionManager, getClassConstructor } from "@meta-system/meta-function-helper";
import Path from "path";
import { MetaProtocol } from "@meta-system/meta-protocol-helper";
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
    const filePath = Path.join(this.installLocation, "node_modules", moduleName);
    console.log(`[Meta Protocols] Retrieving class for ${moduleName}`);

    return (await getClassConstructor(filePath, entrypoint, className)) as
      new (...args : unknown[]) => MetaProtocol<unknown>; // Type defionition in this line
  }
}
