import { dirname, resolve } from "path";
import { readFileSync } from "fs";
import { logger } from "../common/logger/logger.js";
import { isType, optionalIsType } from "../configuration/assertions/is-type.js";
import { MetaFileType } from "../common/meta-file-type.js";

export type ImportedInfo = {
  metaFile : MetaFileType;
  main : MainType;
}

type MainType = {
  boot : Function;
  broker : Function;
}

export class Importer {
  public static async importAddons (metaFilePaths : Record<string, string>) : Promise<Map<string, ImportedInfo>>  {
    const importedAddons = new Map<string, ImportedInfo>();
    for(const identifier of Object.keys(metaFilePaths)) {
      logger.operation(`Importing files for addon "${identifier}"`);
      const files = await this.importFiles(metaFilePaths[identifier]);
      importedAddons.set(identifier, files);
    }
    return importedAddons;
  }

  private static async importFiles (path : string) : Promise<ImportedInfo> {
    const metaFile = JSON.parse(readFileSync(path).toString());
    this.validateMetaFile(metaFile);
    const entrypointPath = resolve(dirname(path), metaFile.entrypoint);
    const imported = await import(entrypointPath);
    const main = imported.__esModule ? this.resolveESM(imported) : imported;
    this.validateMain(main);

    return { metaFile, main };
  }

  private static validateMain (main : unknown) : asserts main is MainType {
    if(typeof main["boot"] !== "function") throw Error("Invalid Boot function");
    if(typeof main["broker"] !== "function") throw Error("Invalid Broker function");
  }

  private static resolveESM (esModule : { default : object }) : object {
    const moduleDefault = esModule.default;
    return {
      boot: moduleDefault["boot"],
      broker: moduleDefault["broker"],
    };
  }

  private static validateMetaFile (metaFile : unknown) : asserts metaFile is MetaFileType {
    optionalIsType("string", "Name must be a string", metaFile["name"]);
    optionalIsType("string", "Version must be a string", metaFile["version"]);

    isType("string", "Entrypoint must be a string", metaFile["entrypoint"]);
  }

}
