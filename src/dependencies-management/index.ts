import { exec } from "child_process";
import { join } from "path";
import FS from "fs";
import { logger } from "../common/logger/logger";

type ModuleName = string;
type ModuleVersion = string;

export class DependenciesManager {
  constructor (private dependencyPath : string) {}
  private readonly installedDeps : Set<string> = new Set();
  private readonly latestVersions : Map<ModuleName, ModuleVersion> = new Map();

  private checkVersionIsInstalled (moduleName : string, version : string) : boolean {
    let currentVersion = version;

    try {
      const installedVersion = this.getInstalledModuleVersion(moduleName);
      if (version === "latest") {
        currentVersion = this.latestVersions.get(moduleName);
      }

      if (currentVersion === installedVersion) {
        return true;
      };
    } catch { return false; }
    return false;
  }

  public async install (moduleName : string, version = "latest") : Promise<void> {
    if (!this.requiresInstallation(moduleName, version)) { return; }

    const installationPromise : Promise<void> = new Promise((resolve, reject) => {
      exec(`npm i --save --prefix ${this.dependencyPath} ${moduleName}@${version}`, (err) => {
        if (err === null) {
          this.installedDeps.add(moduleName);
          if (version === "latest") this.postInstallLatest(moduleName);
          return resolve();
        }

        reject(err);
      });
    });

    await installationPromise;
  }

  /**
   * Gets the raw installed version of the given module. This should be used inside a
   * try catch block due to the nature of sync file system accesses.
   */
  private getInstalledModuleVersion (moduleName : string) : string | undefined {
    const modulePackagePath = join(this.dependencyPath, "node_modules", moduleName, "package.json");
    const packageFile = FS.readFileSync(modulePackagePath, "utf8");
    return JSON.parse(packageFile).version.replace("^", "");
  }

  private postInstallLatest (moduleName : string) : void {
    try {
      const installedVersion = this.getInstalledModuleVersion(moduleName);
      this.latestVersions.set(moduleName, installedVersion);
    } catch (err) {
      const message = "[Dependencies Install] Something went wrong during package installation checking, ABORTING!";
      logger.fatal(message);

      throw Error(err);
    }
  }

  private requiresInstallation (moduleName : string, version : string) : boolean {
    const isInstalled = this.checkVersionIsInstalled(moduleName, version);
    if (isInstalled) {
      logger.operation(`[Dependencies Install] Skipping dependency ${moduleName} as it is already present`);
      return false;
    }

    if (this.installedDeps.has(moduleName) && !isInstalled) {
      const errorMessage = "[Dependencies Install] ERROR: Cannot install two versions of the same dependency!"
        + ` ${moduleName}@${version}`;

      logger.fatal(errorMessage);
      throw Error(errorMessage);
    };

    return true;
  }

  public async remove (moduleName : string) : Promise<void> {
    const removalPromise : Promise<void> = new Promise((resolve, reject) => {
      exec(`npm uninstall --prefix ${this.dependencyPath} ${moduleName} --save`, (err) => {
        if (err === null) return resolve(void 0);

        reject();
      });
    });

    return removalPromise;
  }

  public async uninstallAll () : Promise<void> {
    const hasDependencies = this.installedDeps.size !== 0;
    await FS.promises.rmdir(this.dependencyPath, { recursive: true })
      .catch((error) => {
        if (error.code === "ENOENT" && !hasDependencies) return;
        throw error;
      });

    this.installedDeps.clear();
    this.latestVersions.clear();
  }
}
