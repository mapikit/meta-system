import { environment } from "../../common/execution-env.js";

export class NodeCollectStrategies {
  static async NPMStrategy (moduleName : string, version = "latest", dir : string) : Promise<string> {
    const join = (await import("path")).join;
    const exec = (await import ("child_process")).exec;

    const npmInstallDir = join(environment.constants.configDir, dir);
    const installationPromise : Promise<void> = new Promise((pResolve, pReject) => {
      exec(`npm i --save --prefix "${npmInstallDir}" ${moduleName}@${version}`, (err) => {
        if (err === null) return pResolve();
        pReject(err);
      });
    });

    await installationPromise;
    const path = await NodeCollectStrategies.getDestinationPath(dir, "node_modules", moduleName, "meta-file.json");
    return path;
  }

  static async fileStrategy (path : string) : Promise<string> {
    const { lstatSync, existsSync } = await import("fs");
    const { join, resolve } = (await import("path"));
    const resolvedPath = resolve(environment.constants.configDir, path);
    const pathInfo = lstatSync(resolvedPath);
    if(!existsSync(resolvedPath)) throw Error(`No folder/file found in path \"${resolvedPath}\"`);

    if(pathInfo.isDirectory()) return join(resolvedPath, "meta-file.json");
    return resolvedPath;
  }

  static async urlStrategy (url : string, destinationDir : string) : Promise<string> {
    const join = (await import("path")).join;
    const Nethere = (await import("nethere")).Nethere;
    await Nethere.downloadToDisk(url, destinationDir);

    return join(destinationDir, "meta-file.json");
  }

  static async getDestinationPath (...paths : string[]) : Promise<string> {
    const join = (await import("path")).join;
    return join(environment.constants.configDir, ...paths);
  }
}
