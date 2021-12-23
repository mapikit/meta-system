import { DependenciesManager } from "../../dependencies-management";

export enum ModuleKind {
  NPM = "NPM",
  GITHUB = "GITHUB"
}

export class FunctionsInstaller {
  constructor (
    private readonly functionsFolder : string,
  ) { }

  private installationManager = new DependenciesManager(this.functionsFolder);

  // eslint-disable-next-line max-lines-per-function
  public async install (moduleName : string, version : string, kind : ModuleKind) : Promise<void> {
    if (kind === ModuleKind.GITHUB) {
      throw Error("Not Implemented");
    }

    console.log(`[BOps Function] Installing ${moduleName}@${version}`);
    await this.installationManager.install(moduleName, version)
      .catch((error : Error) => {
        console.error(`[BOps Function] FAILED TO INSTALL - ${moduleName}@${version}`);

        throw error;
      });

    console.log(`[BOps Function] Installed ${moduleName}@${version}`);
  }

  public async uninstall (moduleName : string, kind : ModuleKind) : Promise<void> {
    if (kind === ModuleKind.GITHUB) {
      throw Error("Not Implemented");
    }

    return this.installationManager.remove(moduleName)
      .then(() => void(0));
  }

  public async purgePackages () : Promise<void> {
    await this.installationManager.uninstallAll();
  }
}
