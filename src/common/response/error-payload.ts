import { FailureResponseCodes } from "@api/common/enums/fail-response-codes";
import { ResponseMessages } from "@api/common/enums/response-messages";

export interface MapikitErrorPayload {
  key : FailureResponseCodes;
  message : ResponseMessages;
  statusCode ?: number;
};
