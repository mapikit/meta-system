import { importJsonAndParse } from "../common/helpers/import-json-and-parse.js";
import { logger } from "../common/logger/logger.js";
import { MetaFileType } from "../common/meta-file-type.js";
import { validateMetaFile } from "../entities/helpers/validate-meta-file.js";

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
  public static async importAddons (metaFilePaths : Record<string, string>) : Promise<Map<string, ImportedInfo>>  {
    const importedAddons = new Map<string, ImportedInfo>();
    for(const identifier of Object.keys(metaFilePaths)) {
      logger.operation(`Importing files for addon "${identifier}"`);
      let files : ImportedInfo;
      try {
        files = await this.importFiles(metaFilePaths[identifier], identifier);
      } catch (e) {
        logger.error(`Failed to import addon "${identifier}"!`, e);
        throw e;
      }
      importedAddons.set(identifier, files);
    }
    return importedAddons;
  }

  // TODO implement Browser import for v0.5
  private static async importFiles (path : string, identifier : string) : Promise<ImportedInfo> {
    const metaFile = await importJsonAndParse(path);
    validateMetaFile(metaFile, identifier);
    const pathLib = await import("path");

    const entrypointPath = pathLib.resolve(pathLib.dirname(path), metaFile.entrypoint);
    const imported = await import(entrypointPath);
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
