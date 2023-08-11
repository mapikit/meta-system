import { exec } from "child_process";
import { Addon } from "../configuration/addon-type.js";
// import { environment } from "../common/execution-env.js";
import { join, resolve } from "path";
import { mkdir } from "fs/promises";
import { existsSync, lstatSync } from "fs";
import { logger } from "../common/logger/logger.js";
import { Nethere } from "nethere";

const environment = {
  constants: {
    configDir: "./test-runs",
  },
};
export class Collector {
  constructor (
    public addonsConfigs : Addon[],
    public modulesDirectory : string = "runtime",
  ) {}


  public async collectAddons () : Promise<Record<string, string>> {
    await this.prepare();
    const installedPaths : Record<string, string> = {};
    for (const addonConfig of this.addonsConfigs) {
      const addonPath = await this.collectAddon(addonConfig);
      installedPaths[addonConfig.identifier] = addonPath;
      logger.success("Addon ", addonConfig.identifier, "collected successfully!")
    }
    return installedPaths;
  }


  private async prepare () : Promise<void> { // TODO add CLI for better control of install (IE: Purge)
    try {
      logger.info("Preparing for download of required addons...")
      await mkdir(
        join(environment.constants.configDir, this.modulesDirectory, "url_addons"),
        { recursive: true },
      );
    } catch(err) {}
  }

  private async collectAddon (addon : Addon) : Promise<string> {
    logger.info("Collecting addon ", addon.identifier);
    switch (addon.collectStrategy) {
      case "npm":
        return this.NPMCollectStrategy(addon.source, addon.version);
      case "file":
        return this.fileCollectStrategy(addon.source);
      case "url":
        return this.urlCollectStrategy(addon.source, addon.identifier);
      default:
        throw Error("addon" + addon.identifier + "does not have a valid collected strategy.");
    }
  }

  private async NPMCollectStrategy (moduleName : string, version : string) : Promise<string> {
    const npmInstallDir = join(environment.constants.configDir, this.modulesDirectory);
    const installationPromise : Promise<void> = new Promise((pResolve, pReject) => {
      exec(`npm i --save --prefix ${npmInstallDir} ${moduleName}@${version}`, (err) => {
        if (err === null) {
          //if (version === "latest")
          return pResolve();
        }

        pReject(err);
      });
    });

    await installationPromise;
    return this.getDestinationPath("node_modules", moduleName, "meta-file.json");
  }

  private async fileCollectStrategy (path : string) : Promise<string> {
    const resolvedPath = resolve(environment.constants.configDir, path);
    const pathInfo = lstatSync(resolvedPath);
    if(!existsSync(resolvedPath)) throw Error(`No folder/file found in path \"${resolvedPath}\"`);

    if(pathInfo.isDirectory()) return join(resolvedPath, "meta-file.json");
    return resolvedPath;
  }

  private async urlCollectStrategy (url : string, identifier : string) : Promise<string> {
    const destinationDir = this.getDestinationPath("url_addons", identifier);
    await Nethere.downloadToDisk(url, destinationDir)

    return join(destinationDir, "meta-file.json");
  }

  private getDestinationPath (...paths : string[]) : string {
    return join(environment.constants.configDir, this.modulesDirectory, ...paths);
  }

}
