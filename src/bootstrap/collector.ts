import { environment } from "common/execution-env.js";
import { logger } from "common/logger/logger.js";
import { Addon } from "configuration/addon-type.js";
import { Configuration } from "configuration/configuration.js";
import { join } from "path";
import { ImportedInfo, Strategies } from "./strategies.js";
import { UnpackedFile } from "nethere/dist/types.js";
import { importJsonAndParse } from "common/helpers/import-json-and-parse.js";
import { validateMetaFile } from "entities/helpers/validate-meta-file.js";
import { pathToFileURL } from "url";
import { MetaFileType } from "common/meta-file-type.js";
import { Module } from "module";

type CollectorOptions = {
  runtimeEnv : "node" | "browser";
}

type MainType = {
  boot : Function;
  configure : Function;
}

type ImportedType = {
  [identifier : string] : MainType
}

export class Collector {
  constructor (
    private options : CollectorOptions,
    private systemInfo : Configuration,
    private modulesDirectory : string = "runtime",
  ) {}

  public async collectAddons () : Promise<ImportedType> {
    await this.prepare();
    const imports = {};
    for (const addonConfig of this.systemInfo.addons) {
      const collectedInfo = await this.collectAddon(addonConfig);
      if(typeof collectedInfo === "string") {
        imports[addonConfig.identifier] = Collector.importFiles(collectedInfo, addonConfig.identifier);
      } else {
        imports[addonConfig.identifier] = Collector.importFromMemory(collectedInfo as UnpackedFile[]);
      }
      logger.success("Addon ", addonConfig.identifier, "collected successfully!");
    }
    return imports;
  }

  // eslint-disable-next-line max-lines-per-function
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

  private static async importFromMemory (data : UnpackedFile[]) : Promise<ImportedInfo> {
    const main = {} as MainType;
    const metaFileData = data.find(unpacked => unpacked.header.fileName.endsWith("meta-file.json"));
    const metaFile = JSON.parse(metaFileData.data.toString("utf-8")) as MetaFileType;
    const module = new Module(metaFile.entrypoint); // finish this

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

  private async prepare () : Promise<void> {
    if(this.options.runtimeEnv === "browser") return;

    try {
      logger.info("Preparing for download of required addons...");
      const { mkdir } = await import("fs/promises");
      await mkdir(
        join(environment.constants.configDir, this.modulesDirectory, "url_addons"),
        { recursive: true },
      );
      await this.resolvePackageFile();
    } catch(err) { logger.error(err); }
  }

  // eslint-disable-next-line max-lines-per-function
  private async resolvePackageFile () : Promise<void> {
    const path = join(environment.constants.configDir, this.modulesDirectory, "package.json");
    const { readFile, writeFileSync } = await import("fs");
    return new Promise<void>((pResolve) => {
      readFile(path, (error, data) => {
        if(error && error.code === "ENOENT") logger.info("Creating package.json file for npm addons");
        const file = JSON.parse(data?.toString() ?? "{}");

        const NPMInfo = {
          ...file,
          name: this.systemInfo.name ?? file?.name,
          version: this.systemInfo.version ?? file?.version,
        };
        writeFileSync(path, JSON.stringify(NPMInfo, undefined, 4));
        pResolve();
      });
    });
  }

  private static resolveESM (esModule : { default : object }) : MainType {
    const moduleDefault = esModule.default;
    return {
      boot: moduleDefault["boot"],
      configure: moduleDefault["configure"],
    };
  }

  private async collectAddon (addon : Addon) : Promise<string | UnpackedFile[]> {
    logger.info("Collecting addon ", addon.identifier);

    switch (`${addon.collectStrategy}@${this.options.runtimeEnv}`) {
      case "npm@node":
        return Strategies.NPMCollectStrategy(addon.source, addon.version, this.modulesDirectory);
      case "file@node":
        return Strategies.fileCollectStrategy(addon.source);
      case "url@node":
        return Strategies.urlCollectStrategy(addon.source, addon.identifier);
      case "url@browser":
        return Strategies.browserUrlStrategy(addon.source);
      default:
        throw Error("addon" + addon.identifier + "does not have a valid collected strategy.");
    }
  }
}
