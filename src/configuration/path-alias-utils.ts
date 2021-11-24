/* eslint-disable max-lines-per-function */
import { readFileSync } from "fs";
import { sync as glob } from "glob";
import Path from "path";
import { environment } from "../common/execution-env";

export class PathUtils {
  public static getContents <T> (arrayOrPath : T[] | string, parentPath = "") : T[] {
    if(Array.isArray(arrayOrPath)) {
      const contents = [];
      arrayOrPath.forEach(entry => contents.push(...this.getContent(entry, parentPath)));
      return contents;
    } else if(typeof arrayOrPath === "string") {
      const contents = this.getContentsFromPath<T>(arrayOrPath, parentPath);
      return this.getContents(contents, arrayOrPath);
    }
  }

  private static getContent <T> (valueOrPath : T | string, parentValue ?: string | T[]) : T[] {
    const parentPath = this.resolveParentPath(parentValue);
    if(typeof valueOrPath === "string") return this.getContentsFromPath(valueOrPath, parentPath);
    if(Array.isArray(valueOrPath)) return this.getContents(valueOrPath, parentPath);

    return [valueOrPath];
  }

  private static getContentsFromPath<T> (path : string, parentPath : string) : T[] {
    const jsons : Array<T> = [];
    const files = glob(Path.resolve(parentPath, path));
    files.forEach(file => {
      const fileContent = readFileSync(file, "utf8");
      const fileInfo = JSON.parse(fileContent) as T | T[];
      const infoArray = Array.isArray(fileInfo) ?
        this.getContents(fileInfo, path) :
        [fileInfo];
      jsons.push(...infoArray);
    });
    return jsons;
  }

  private static resolveParentPath (parentValue : string | unknown) : string {
    if(typeof parentValue !== "string") return environment.constants.configDir as string ?? "";
    return Path.parse(parentValue).dir;
  }
}
