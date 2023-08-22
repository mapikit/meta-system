import { validateObject } from "@meta-system/object-definition";
import { importJsonAndParse } from "../common/helpers/import-json-and-parse.js";
import { logger } from "../common/logger/logger.js";
import { MetaFileType, metaFileObjectDefinition } from "../common/meta-file-type.js";
import { validateMetaFile } from "../entities/helpers/validate-meta-file.js";
import { pathToFileURL } from "url";

export type ImportedInfo = {
  metaFile : MetaFileType;
  main : MainType;
}

type MainType = {
  boot : Function;
  configure : Function;
}

// TODO: Test
export class Importer {
  // eslint-disable-next-line max-lines-per-function
  public static async importAddons (metaFilePaths : Record<string, string>) : Promise<Map<string, ImportedInfo>>  {
    const importedAddons = new Map<string, ImportedInfo>();
    for(const identifier of Object.keys(metaFilePaths)) {
      logger.operation(`Importing files for addon "${identifier}"`);
      let files : ImportedInfo;
      try {
        files = await this.importFiles(metaFilePaths[identifier], identifier);
        this.validateMetaFile(files);
      } catch (e) {
        logger.error(`Failed to import addon "${identifier}"!`, e);
        throw e;
      }
      importedAddons.set(identifier, files);
    }
    return importedAddons;
  }

  private static validateMetaFile (imported : ImportedInfo) : void {
    const metaFileConfigurationValidation = validateObject(imported.metaFile, metaFileObjectDefinition);

    if (metaFileConfigurationValidation.errors.length > 0) {
      const message = "Addon meta-file is not valid!";
      logger.fatal(message);
      metaFileConfigurationValidation.errors.forEach((validationError) => {
        logger.error(validationError.error, " at ", validationError.path);
      });

      throw Error(message);
    }
  }

  // TODO implement Browser import
  private static async importFiles (path : string, identifier : string) : Promise<ImportedInfo> {
    const metaFile = await importJsonAndParse(path);
    validateMetaFile(metaFile, identifier);
    const pathLib = await import("path");

    const entrypointPath = pathLib.resolve(pathLib.dirname(path), metaFile.entrypoint);
    const entrypointPathURL = pathToFileURL(entrypointPath);
    const imported = await import(entrypointPathURL.href);
    const main = imported.__esModule ? this.resolveESM(imported) : imported;
    this.validateMain(main, identifier);

    return { metaFile, main };
  }

  private static validateMain (main : unknown, addonName : string) : asserts main is MainType {
    if(typeof main["boot"] !== "function") {
      // eslint-disable-next-line max-len
      logger.error(`[ADDON VALIDATION] - Addon with identifier "${addonName}" is not valid! Missing "boot" function from entrypoint!`);
      throw Error("Invalid Boot function");
    };

    if(typeof main["configure"] !== "function") {
      // eslint-disable-next-line max-len
      logger.error(`[ADDON VALIDATION] - Addon with identifier "${addonName}" is not valid! Missing "configure" function from entrypoint!`);
      throw Error("Invalid Configure function");
    }
  }

  private static resolveESM (esModule : { default : object }) : MainType {
    const moduleDefault = esModule.default;
    return {
      boot: moduleDefault["boot"],
      configure: moduleDefault["configure"],
    };
  }

}
