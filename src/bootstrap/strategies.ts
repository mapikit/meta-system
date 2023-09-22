import { environment } from "../common/execution-env.js";
import type { UnpackedFile } from "nethere/dist/types.js";

export class Strategies {
  static async NPMCollectStrategy (moduleName : string, version = "latest", dir : string) : Promise<string> {
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
    const path = await Strategies.getDestinationPath(dir, "node_modules", moduleName, "meta-file.json");
    return path;
  }

  static async fileCollectStrategy (path : string) : Promise<string> {
    const { lstatSync, existsSync } = await import("fs");
    const { join, resolve } = (await import("path"));
    const resolvedPath = resolve(environment.constants.configDir, path);
    const pathInfo = lstatSync(resolvedPath);
    if(!existsSync(resolvedPath)) throw Error(`No folder/file found in path \"${resolvedPath}\"`);

    if(pathInfo.isDirectory()) return join(resolvedPath, "meta-file.json");
    return resolvedPath;
  }

  static async urlCollectStrategy (url : string, destinationDir : string) : Promise<string> {
    const join = (await import("path")).join;
    const Nethere = (await import("nethere")).Nethere;
    await Nethere.downloadToDisk(url, destinationDir);

    return join(destinationDir, "meta-file.json");
  }

  static async browserUrlStrategy (url : string) : Promise<UnpackedFile[]> {
    const Nethere = (await import("nethere")).Nethere;
    const data = await Nethere.downloadToMemory(url);

    return data;
  }

  static async getDestinationPath (...paths : string[]) : Promise<string> {
    const join = (await import("path")).join;
    return join(environment.constants.configDir, ...paths);
  }
}
