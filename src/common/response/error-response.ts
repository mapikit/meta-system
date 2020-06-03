import * as Http from "http-status-codes";
import { MapikitResponsePayload } from "@api/common/response/response-payload";
import { MapikitErrorPayload } from "@api/common/response/error-payload";

export interface MapikitError extends MapikitResponsePayload {
  data : {
    code : string;
    message : string;
  };
}

export class ErrorResponse {
  public code : string;
  public message : string;
  public statusCode : number;

  public constructor (errorData : MapikitErrorPayload) {
    this.code = errorData.key;
    this.message = errorData.message;
    this.statusCode = errorData.statusCode ?? Http.INTERNAL_SERVER_ERROR; // Defaults to 500
  }

  public get body () : MapikitError {
    return {
      data: {
        code: this.code,
        message: this.message,
      },
      statusCode: this.statusCode,
    };
  }
}
