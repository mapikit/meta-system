import { environment } from "../common/execution-env.js";
import { logger } from "../common/logger/logger.js";
import { Addon } from "../configuration/addon-type.js";
import { Configuration } from "../configuration/configuration.js";
import { Strategies } from "./collect-strategies/strategies.js";
import { importJsonAndParse } from "../common/helpers/import-json-and-parse.js";
import { validateMetaFile } from "../entities/helpers/validate-meta-file.js";
import { MetaFileType } from "../common/meta-file-type.js";
import type { UnpackedFile } from "nethere/dist/types.js";
import { Bundler } from "../bundler/lite-bundler.js";

type CollectorOptions = {
  runtimeEnv : "node" | "browser";
}

type MainType = {
  boot : Function;
  configure : Function;
}

export type ImportedInfo = {
  metaFile : MetaFileType;
  main : MainType;
  identifier : string;
}

export type ImportedType = Map<string, ImportedInfo>;

export class Collector {
  constructor (
    private options : CollectorOptions,
    private systemInfo : Pick<Configuration, "addons" | "name" | "version">,
    private modulesDirectory : string = "runtime",
  ) {}

  public async collectAddons () : Promise<ImportedInfo[]> {
    await this.prepare();
    const importedMap = new Map<string, ImportedInfo>();

    logger.info("Collecting all addons in parallel");
    await Promise.all(this.systemInfo.addons.map(addon =>
      this.collectAddon(addon).then(async (collected) => {
        const imported = typeof collected === "string" ?
          await Collector.importFiles(collected, addon.identifier) :
          await Collector.importFromMemory(collected, addon.identifier);
        logger.success(`Addon ${addon.identifier} successfully collected imported!`);
        importedMap.set(addon.identifier, imported);
      })),
    );

    // So we maintain order, even though loaded in parallel :)
    return this.systemInfo.addons.map((configAddon) => importedMap.get(configAddon.identifier));
  }

  // eslint-disable-next-line max-lines-per-function
  private static async importFiles (path : string, identifier : string) : Promise<ImportedInfo> {
    const metaFile = await importJsonAndParse(path);
    validateMetaFile(metaFile, identifier);
    const pathLib = await import("path");

    const pathToFileURL = (await import("url")).pathToFileURL;

    const entrypointPath = pathLib.resolve(pathLib.dirname(path), metaFile.entrypoint);
    const entrypointPathURL = pathToFileURL(entrypointPath);
    const imported = await import(entrypointPathURL.href);
    const main = imported.__esModule ? this.resolveESM(imported) : imported;
    this.validateMain(main, identifier);

    return { metaFile, main, identifier };
  }

  public static async importFromMemory (data : UnpackedFile[], identifier : string) : Promise<ImportedInfo> {
    const metaFileData = data.find(unpacked => unpacked.header.fileName.endsWith("meta-file.json"));

    const metaFile = JSON.parse(metaFileData.data.toString("utf-8")) as MetaFileType;
    if(metaFile === undefined) throw Error("File \"meta-file.json\" was not found!!");

    const entrypointPath = Bundler.resolveFullPath(metaFileData.header.fileName, metaFile.entrypoint);
    if(data.find(file => file.header.fileName === entrypointPath) === undefined) throw Error("Entrypoint not found!!");

    const bundler = new Bundler(entrypointPath, data, identifier);
    const result = await import(`data:text/javascript,${encodeURIComponent(bundler.bundle())}`);
    const main = {
      boot: result.boot,
      configure: result.configure,
    };

    this.validateMain(main, metaFile.name);

    return { metaFile, main, identifier };
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

    const join = (await import("path")).join;

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
    const join = (await import("path")).join;
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

  // eslint-disable-next-line max-lines-per-function
  public async collectAddon (addon : Addon) : Promise<string | UnpackedFile[]> {
    logger.info("Collecting addon ", addon.identifier);

    switch (`${addon.collectStrategy}@${this.options.runtimeEnv}`) {
      case "npm@node":
        return Strategies.node.NPMStrategy(addon.source, addon.version, this.modulesDirectory);
      case "file@node":
        return Strategies.node.fileStrategy(addon.source);
      case "url@node":
        return Strategies.node.urlStrategy(addon.source, addon.identifier);
      case "url@browser":
        return Strategies.browser.urlStrategy(addon.source);
      case "npm@browser":
        return Strategies.browser.npmStrategy(addon.source, addon.version, addon.identifier);
      default:
        throw Error("addon" + addon.identifier + "does not have a valid collected strategy.");
    }
  }
}
