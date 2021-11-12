/* eslint-disable max-lines-per-function */
import { readFileSync } from "fs";
import { sync as glob } from "glob";
import Path from "path";

export class PathUtils {
  public static getContent<T> (value : string | T, parentValue ?: string | T[]) : T[] {
    if(typeof value !== "string") return [value];
    const parentPath = this.resolveParentPath(parentValue);
    const jsons : Array<T> = [];
    const files = glob(Path.resolve(parentPath, value));
    files.forEach(file => {
      const fileContent = readFileSync(file, "utf8");
      const fileInfo = JSON.parse(fileContent);
      if(Array.isArray(fileInfo)) {
        fileInfo.forEach(info => {
          jsons.push(...PathUtils.getContent(info, value));
        });
      } else jsons.push(fileInfo);
    });
    return jsons;
  }

  private static resolveParentPath (parentValue : string | unknown) : string {
    if(typeof parentValue !== "string") return process.env.configDir ?? "";
    return Path.parse(parentValue).dir;
  }
}
