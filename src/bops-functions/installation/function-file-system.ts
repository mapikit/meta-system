// Controls file and dependency structure for BOps functions.

import { assert } from "console";
import FS from "fs";
import Path from "path";
const fsPromise = FS.promises;

export class FunctionFileSystem {
  private readonly customFunctionsLocation : string;
  private readonly configurationFileName : string;
  private readonly packageFileName : string;

  public constructor (
    customFunctionsLocation : string,
    configurationFileName : string,
    packageFileName : string,
  ) {
    this.customFunctionsLocation = customFunctionsLocation;
    this.configurationFileName = configurationFileName;
    this.packageFileName = packageFileName;
  }

  /**
   * Finds and retrieve the configuration file for a given moduleName
   * @param moduleName
   */
  public async getDescriptionFile (moduleName : string, moduleType : "function" | "package") : Promise<string> {
    const fileName = moduleType === "function" ? this.configurationFileName : this.packageFileName;

    const filePath = Path.join(this.customFunctionsLocation, moduleName, fileName);

    console.log(`[BOPs Function] Retrieving Description File for ${moduleName}`);

    const file = fsPromise.readFile(filePath, "utf8")
      .then((result) => {
        console.log(`[BOPs Function] Success - Retrieved Description File for ${moduleName}`);

        return result;
      });

    return file;
  }

  public async import (moduleName : string, entrypoint : string, mainFunctionName ?: string)
    : Promise<Function | Record<string, Function>> {
    const filePath = Path.join(this.customFunctionsLocation, moduleName, entrypoint);
    console.log(`[BOPs Function] Retrieving main function for ${moduleName}`);

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const importedEntrypoint = require(filePath);

    if (mainFunctionName !== undefined) {
      const result = importedEntrypoint[mainFunctionName];
      assert(typeof result === "function");
      console.log(`[BOPs Function] Success - Retrieved main function for ${moduleName}`);
      return result;
    }

    // Packages are an object which the keys are strings and the values are functions.
    return importedEntrypoint;
  }
}
