import { Procedure } from "birbs";
import { MapikitResponsePayload } from "@api/common/response/response-payload";
import { MapikitResponse } from "@api/common/types/mapikit-response";

export class SetResponse extends Procedure {
  constructor () {
    super({ lifetime: "SINGLE" });
  }

  public async execute (context : MapikitResponse, data ?: MapikitResponsePayload) : Promise<void> {
    context.responsePayload = data;
    context.send();
  }
}
