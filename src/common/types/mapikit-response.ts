import { Context } from "birbs";
import { Response } from "express";
import { MapikitResponsePayload } from "@api/common/response/response-payload";

export class MapikitResponse extends Context {
  private payload : MapikitResponsePayload;
  public readonly response : Response;
  private sent = false;

  public constructor (res : Response) {
    super({ identifier: Symbol("response") });
    this.response = res;
  };

  public send () : void {
    if (this.sent) return;

    this.response.statusCode = this.payload.statusCode;
    this.response.send(this.payload.data);

    this.sent = true;
  }

  public set responsePayload (payload : MapikitResponsePayload) {
    this.payload = payload;
  };
};
