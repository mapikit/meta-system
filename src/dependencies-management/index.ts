import { exec } from "child_process";
import { join } from "path";
import FS from "fs";

export class DependenciesManager {
  constructor (private dependencyPath : string) {}
  private readonly installedDeps : Set<string> = new Set();

  private checkInstalled (name : string, version : string) : boolean {
    const modulePackagePath = join(this.dependencyPath, "node_modules", name, "package.json");
    try {
      const packageFile = FS.readFileSync(modulePackagePath, "utf8");
      const installedVersion = JSON.parse(packageFile).version.replace("^", "");
      if(version === installedVersion) return true;
    } catch { return false; }
    return false;
  }

  // eslint-disable-next-line max-lines-per-function
  public async install (moduleName : string, version = "latest") : Promise<void> {
    if (this.installedDeps.has(`${moduleName}`)) {
      const errorMessage = "[Dependencies Install] ERROR: Cannot install two versions of the same dependency!"
        + ` ${moduleName}@${version}`;

      throw Error(errorMessage);
    };

    if (this.checkInstalled(moduleName, version)) {
      console.log(`[Dependencies Install] Skipping dependency ${moduleName} as it is already present`);
      return;
    };

    const installationPromise : Promise<void> = new Promise((resolve, reject) => {
      exec(`npm i --prefix ${this.dependencyPath} ${moduleName}@${version} --save`, (err) => {
        if (err === null) {
          this.installedDeps.add(moduleName);
          return resolve();
        }

        reject();
      });
    });

    return installationPromise;
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
    await FS.promises.rmdir(`${this.dependencyPath}`, { recursive: true });
    this.installedDeps.clear();
  }
}
