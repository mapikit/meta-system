import { PluginManager } from "live-plugin-manager";

export enum ModuleKind {
  NPM = "NPM",
  GITHUB = "GITHUB"
}

export class FunctionsInstaller {
  constructor (
    private readonly functionsFolder : string,
  ) { }

  private installationManager = new PluginManager({
    pluginsPath: this.functionsFolder,
  });

  public async install (moduleName : string, version : string, kind : ModuleKind) : Promise<void> {
    if (kind !== ModuleKind.NPM) {
      throw Error("Not Implemented");
    }

    console.log(`[BOps Function] Installing ${moduleName}@${version}`);
    await this.installationManager.installFromNpm(moduleName, version)
      .catch((error : Error) => {
        console.error(`[BOps Function] FAILED TO INSTALL - ${moduleName}@${version}`);

        throw error;
      });
    ;
    console.log(`[BOps Function] Installed ${moduleName}@${version}`);
  }

  public async uninstall (moduleName : string, kind : ModuleKind) : Promise<void> {
    if (kind !== ModuleKind.NPM) {
      throw Error("Not Implemented");
    }

    return this.installationManager.uninstall(moduleName)
      .then(() => void(0));
  }

  public async purgePackages () : Promise<void> {
    await this.installationManager.uninstallAll();
  }
}
