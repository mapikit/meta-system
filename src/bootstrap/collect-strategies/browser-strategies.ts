import { logger } from "../../common/logger/logger.js";
import type { Header, UnpackedFile } from "nethere/dist/types.js";

export class BrowserCollectStrategies {
  static async urlStrategy (url : string) : Promise<UnpackedFile[]> {
    const Nethere = (await import("nethere")).Nethere;
    const data = await Nethere.downloadToMemory(url);

    return data;
  }

  // eslint-disable-next-line max-lines-per-function
  static async npmStrategy (packageName : string, packageVersion = "latest", id : string) : Promise<UnpackedFile[]> {
    logger.debug(`[${id}] Grabbing ${packageName} with version ${packageVersion} from unpkg.com`);
    const baseUrl = await this.getUnPkgRedirect(packageName, packageVersion);

    const fileStruct = JSON.parse((await this.getFileFromUnPkg(`${baseUrl}/?meta`)).toString());
    const filesList = this.mapUnPkgFiles(fileStruct);

    const unpackedFiles : UnpackedFile[] = [];
    await Promise.all(
      filesList.map(path => new Promise<void>((resolve, reject) => {
        this.getFileFromUnPkg(`${baseUrl}${path}`).then((result) => {
          unpackedFiles.push({
            data: Buffer.from(result),
            header: { fileName: path } as Header,
          });
          resolve();
        }).catch(reject);
      })),
    );
    logger.info("Addon", `${packageName}@${packageVersion}`, "Acquired from NPM");
    return unpackedFiles;
  }

  private static mapUnPkgFiles (fileStruct : object, filesArray : Array<string> = []) : Array<string> {
    if(fileStruct["type"] === "directory") fileStruct["files"].forEach(file => this.mapUnPkgFiles(file, filesArray));
    else filesArray.push(fileStruct["path"]);
    return filesArray;
  }

  // eslint-disable-next-line max-lines-per-function
  private static async getFileFromUnPkg (filePath : string) : Promise<Buffer> {
    const { get } = await import("https");

    return new Promise<Buffer>((resolve, reject) => {
      get(`https://unpkg.com${filePath}`, (finalRequest) => {
        finalRequest.addListener("error", reject);
        const buffersList = [];
        finalRequest.addListener("data", (data : Buffer) => { buffersList.push(data); });
        finalRequest.addListener("close", () => { resolve(Buffer.concat(buffersList)); });
      });
    });
  }

  private static async getUnPkgRedirect (packageName : string, packageVersion = "latest") : Promise<string> {
    const { get } = await import("https");

    if(!(packageVersion === "latest" || packageVersion === "")) return `/${packageName}@${packageVersion}`;

    return new Promise<string>((resolve, reject) => {
      get(`https://unpkg.com/${packageName}`, (request) => {
        let stringifiedData = "";
        request.addListener("error", reject);
        request.addListener("data", (data : Buffer) => { stringifiedData += data.toString(); });
        request.addListener("close", () => {
          const finalPath = stringifiedData.replace("Found. Redirecting to ", "").trim();
          resolve(finalPath);
        });
      });
    });
  };
}
