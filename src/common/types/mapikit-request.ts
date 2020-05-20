import { IncomingHttpHeaders } from "http";

interface UsefulRequestData {
  headers ?: IncomingHttpHeaders;
  params ?: { [key : string] : string };
  body ?: unknown;
}

export class MapikitRequest {
  public headers : IncomingHttpHeaders = {};
  public constructor (request : UsefulRequestData) {
    Object.assign(this.headers, request.headers);
    Object.assign(this, request.params);
    Object.assign(this, request.body);
  }
};
