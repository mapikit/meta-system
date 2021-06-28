// Controls file and dependency structure for BOps functions.

import { assert } from "console";
import FS from "fs";
import Path from "path";
const fsPromise = FS.promises;

export class FunctionFileSystem {
  private readonly customFunctionsLocation : string;
  private readonly configurationFileName : string;

  public constructor (
    customFunctionsLocation : string,
    configurationFileName : string,
  ) {
    this.customFunctionsLocation = customFunctionsLocation;
    this.configurationFileName = configurationFileName;
  }

  /**
   * Finds and retrieve the meta-function.json file for a given moduleName
   * @param moduleName
   */
  public async getFunctionDescriptionFile (moduleName : string) : Promise<string> {
    const filePath = Path.join(this.customFunctionsLocation, moduleName, this.configurationFileName);

    console.log(`[BOPs Function] Retrieving Description File for ${moduleName}`);

    return fsPromise.readFile(filePath, "utf8")
      .then((result) => {
        console.log(`[BOPs Function] Success - Retrieved Description File for ${moduleName}`);

        return result;
      });
  }

  public async importMain (moduleName : string, entrypoint : string, mainFunctionName : string)
    : Promise<(...args : unknown[]) => unknown> {
    const filePath = Path.join(this.customFunctionsLocation, moduleName, entrypoint);
    console.log(`[BOPs Function] Retrieving main function for ${moduleName}`);

    const result = require(filePath)[mainFunctionName];
    assert(typeof result === "function");

    console.log(`[BOPs Function] Success - Retrieved main function for ${moduleName}`);
    return result;
  }
}
