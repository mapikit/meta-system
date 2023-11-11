import { UnpackedFile } from "nethere/dist/types.js";

export class BrowserCollectStrategies {
  static async urlStrategy (url : string) : Promise<UnpackedFile[]> {
    const Nethere = (await import("nethere")).Nethere;
    const data = await Nethere.downloadToMemory(url);

    return data;
  }
}
