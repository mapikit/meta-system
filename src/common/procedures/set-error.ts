import { Procedure } from "birbs";
import { MapikitResponse } from "@api/common/types/mapikit-response";
import { ErrorResponse } from "@api/common/response/error-response";
import { assertErrorPayload } from "@api/common/assertions/assert-is-error-response";
import { MapikitErrorPayload } from "@api/common/response/error-payload";

export class SetError extends Procedure {
  constructor () {
    super({ lifetime: "SINGLE" });
  }

  public async execute (context : MapikitResponse, data ?: MapikitErrorPayload) : Promise<void> {
    context.responsePayload = this.buildResponse(context, data).body;
    context.send();
  }

  private buildResponse (context : MapikitResponse, payload ?: MapikitErrorPayload) : ErrorResponse {
    assertErrorPayload(payload);

    return new ErrorResponse(payload);
  }
}
