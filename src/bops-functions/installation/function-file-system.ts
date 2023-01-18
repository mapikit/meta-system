// Controls file and dependency structure for BOps functions.

import { getClassConstructor, getDescriptorFileContent } from "@meta-system/meta-function-helper";
import Path from "path";
import { logger } from "../../common/logger/logger";

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
  public async getDescriptionFile (moduleName : string, moduleType : "function" | "package") : Promise<unknown> {
    const fileName = moduleType === "function" ? this.configurationFileName : this.packageFileName;
    const filePath = Path.join(this.customFunctionsLocation, "node_modules", moduleName);

    logger.operation(`[BOPs Function] Retrieving Description File for ${moduleName}`);
    const file = await getDescriptorFileContent(filePath, fileName)
      .then((result) => {
        logger.success(`[BOPs Function] Success - Retrieved Description File for ${moduleName}`);

        return result;
      });

    return file["default"];
  }

  public async import (moduleName : string, entrypoint : string, mainFunctionName ?: string)
    : Promise<Function | Record<string, Function>> {
    const filePath = Path.join(this.customFunctionsLocation, "node_modules", moduleName);
    logger.operation(`[BOPs Function] Retrieving main function/package for ${moduleName}`);

    // Actually just a general "import"
    const result = await getClassConstructor(filePath, entrypoint, mainFunctionName);
    logger.success(`[BOPs Function] Success - Retrieved main function for ${moduleName}`);

    return result as Function | Record<string, Function>;
  }
}
