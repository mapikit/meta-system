import { exec } from "child_process";
import FS from "fs";

export class DependenciesManager {
  private readonly installedDeps : Set<string> = new Set();

  private checkInstalled (name : string) : boolean {
    const installedModulesPath = `${process.cwd()}/node_modules/${name}`;
    return FS.existsSync(installedModulesPath);
  }

  // eslint-disable-next-line max-lines-per-function
  public async install (moduleName : string, version = "latest") : Promise<void> {
    if (this.installedDeps.has(`${moduleName}`)) {
      const errorMessage = "[Dependencies Install] ERROR: Cannot install two versions of the same package!"
        + ` ${moduleName}@${version}`;

      throw Error(errorMessage);
    };

    if (this.checkInstalled(moduleName)) return;

    const installationPromise : Promise<void> = new Promise((resolve, reject) => {
      exec(`npm i ${moduleName}@${version} --save`, (err) => {
        if (err === null) return resolve(void 0);

        reject();
      });
    });

    this.installedDeps.add(moduleName);

    return installationPromise;
  }

  public async remove (moduleName : string) : Promise<void> {
    const removalPromise : Promise<void> = new Promise((resolve, reject) => {
      exec(`npm uninstall ${moduleName} --save`, (err) => {
        if (err === null) return resolve(void 0);

        reject();
      });
    });

    return removalPromise;
  }

  public async uninstallAll () : Promise<void> {
    await FS.promises.rmdir(`${process.cwd()}/node_modules`);
  }
}
