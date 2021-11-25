import { sync as glob } from "glob";
import Path from "path";
import { environment } from "../common/execution-env";

export class PathUtils {
  public static async getContents <T> (arrayOrPath : T[] | string, parentPath = "") : Promise<T[]> {
    if(Array.isArray(arrayOrPath)) {
      const contents = [];
      for(const entry of arrayOrPath) {
        contents.push(...(await this.getContent(entry, parentPath)));
      }
      return contents;
    } else if(typeof arrayOrPath === "string") {
      const contents = await this.getContentsFromPath<T>(arrayOrPath, parentPath);
      return this.getContents(contents, arrayOrPath);
    }
  }

  private static async getContent <T> (valueOrPath : T | string, parentValue ?: string | T[]) : Promise<T[]> {
    const parentPath = this.resolveParentPath(parentValue);
    if(typeof valueOrPath === "string") {
      return this.getContentsFromPath<T>(valueOrPath, parentPath);
    }
    if(Array.isArray(valueOrPath)) return this.getContents(valueOrPath, parentPath);

    return [valueOrPath];
  }

  private static async getContentsFromPath<T> (path : string, parentPath : string) : Promise<T[]> {
    const jsons : Array<T> = [];
    const files = glob(Path.resolve(parentPath, path));
    for(const file of files) {
      const fileInfo = await import(file);
      const infoArray = Array.isArray(fileInfo.default) ?
        await this.getContents(fileInfo.default, path) :
        [fileInfo.default];
      jsons.push(...(infoArray as T[]));
    }
    return jsons;
  }

  private static resolveParentPath (parentValue : string | unknown) : string {
    if(typeof parentValue !== "string") return environment.constants.configDir as string ?? "";
    return Path.parse(parentValue).dir;
  }
}
