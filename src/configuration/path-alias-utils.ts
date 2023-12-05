import { ConfigurationType } from "./configuration-type.js";
import { environment } from "../common/execution-env.js";
import { importJsonAndParse } from "../common/helpers/import-json-and-parse.js";

// TODO: Test
export class PathUtils {
  public static async getContents <T> (arrayOrPath : T[] | string, parentPath ?: string) : Promise<T[]> {
    if(Array.isArray(arrayOrPath)) {
      const contents = [];
      for(const entry of arrayOrPath) {
        contents.push(...(await this.getContent(entry, parentPath)));
      }
      return contents;
    }
    const contents = await this.getContentsFromPath<T>(arrayOrPath, parentPath);
    return this.getContents(contents, arrayOrPath);
  }

  private static async getContent <T> (valueOrPath : T | string, parentValue ?: string | T[]) : Promise<T[]> {
    const parentPath = await this.resolveParentPath(parentValue);
    if(typeof valueOrPath === "string") {
      return this.getContentsFromPath<T>(valueOrPath, parentPath);
    }
    if(Array.isArray(valueOrPath)) return this.getContents(valueOrPath, parentPath);

    return [valueOrPath];
  }

  private static async getContentsFromPath<T> (path : string, parentPath : string) : Promise<T[]> {
    const Path = await import("path");
    const glob = (await import("glob")).sync;
    const jsons : Array<T> = [];
    const files = glob(Path.resolve(await this.resolveParentPath(parentPath), path).split(Path.sep).join("/"));
    for(const file of files) {
      const fileInfo = await importJsonAndParse(file);
      const infoArray = Array.isArray(fileInfo) ?
        await this.getContents(fileInfo, path) :
        [fileInfo];
      jsons.push(...(infoArray as T[]));
    }
    return jsons;
  }

  private static async resolveParentPath (parentValue : string | unknown) : Promise<string> {
    const Path = await import("path");
    if(typeof parentValue !== "string") return environment.constants.configDir as string ?? "";
    const parentPath = Path.parse(parentValue);
    return parentPath.root === "" ? environment.constants.configDir : parentPath.dir;
  }

  public static async getFinalFilesPaths (systemConfig : ConfigurationType) : Promise<string[]> {
    const paths : string[] = [];
    const replaceableTypes : Array<keyof ConfigurationType> = ["businessOperations", "addons", "schemas"];
    const parentPath = environment.constants.configDir;

    for(const type of replaceableTypes) {
      paths.push(...(await this.getPaths(systemConfig[type], parentPath)));
    }
    return paths;
  }

  private static async getPaths (value : unknown[] | string, parentPath = "") : Promise<string[]> {
    const Path = await import("path");
    const glob = (await import("glob")).sync;

    let files : Array<string> = [];

    if(typeof value === "string") {
      if(value.includes("*")) files = glob(Path.resolve(parentPath, value).split(Path.sep).join("/"));
      else files.push(Path.resolve(parentPath, value));
    }
    else if(Array.isArray(value)) {
      for(const val of value) {
        files.push(...(await this.getPaths(val as string, parentPath)));
      }
    }
    return files;
  }
}
