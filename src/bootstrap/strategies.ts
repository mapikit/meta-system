import { exec } from "child_process";
import { environment } from "../common/execution-env.js";
import { join, resolve } from "path";
import { Nethere } from "nethere";
import { MetaFileType } from "common/meta-file-type.js";
import { UnpackedFile } from "nethere/dist/types.js";

export type ImportedInfo = {
  metaFile : MetaFileType;
  main : MainType;
}

type MainType = {
  boot : Function;
  configure : Function;
}

export class Strategies {
  static async NPMCollectStrategy (moduleName : string, version = "latest", dir : string) : Promise<string> {
    const npmInstallDir = join(environment.constants.configDir, dir);
    const installationPromise : Promise<void> = new Promise((pResolve, pReject) => {
      exec(`npm i --save --prefix "${npmInstallDir}" ${moduleName}@${version}`, (err) => {
        if (err === null) return pResolve();
        pReject(err);
      });
    });

    await installationPromise;
    return Strategies.getDestinationPath(dir, "node_modules", moduleName, "meta-file.json");
  }

  static async fileCollectStrategy (path : string) : Promise<string> {
    const { lstatSync, existsSync } = await import("fs");
    const resolvedPath = resolve(environment.constants.configDir, path);
    const pathInfo = lstatSync(resolvedPath);
    if(!existsSync(resolvedPath)) throw Error(`No folder/file found in path \"${resolvedPath}\"`);

    if(pathInfo.isDirectory()) return join(resolvedPath, "meta-file.json");
    return resolvedPath;
  }

  static async urlCollectStrategy (url : string, destinationDir : string) : Promise<string> {
    await Nethere.downloadToDisk(url, destinationDir);

    return join(destinationDir, "meta-file.json");
  }

  static async browserUrlStrategy (url : string) : Promise<UnpackedFile[]> {
    const data = await Nethere.downloadToMemory(url);

    return data;
  }

  static getDestinationPath (...paths : string[]) : string {
    return join(environment.constants.configDir, ...paths);
  }
}
