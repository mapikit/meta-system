import { FailureResponseCodes } from "@api/common/enums/fail-response-codes";
import { ResponseMessages } from "@api/common/enums/response-messages";
import { MapikitErrorPayload } from "@api/common/response/error-payload";
import { isHttpError } from "@api/common/helpers/is-http-error";
import { logger } from "@api/mapikit/logger/logger";

// TODO: Test this
export function assertErrorPayload (responsePayload : MapikitErrorPayload)
  : asserts responsePayload is MapikitErrorPayload {

  if (!Object.values(FailureResponseCodes).includes(responsePayload.key)) {
    logger.debug({ message: "Error payload did not contain a \"key\" value" });
    throw TypeError("Invalid Error Payload");
  }

  if (!Object.values(ResponseMessages).includes(responsePayload.message)) {
    logger.debug({ message: "Error payload did not contain a \"message\" value" });
    throw TypeError("Invalid Error Payload");
  }

  if (!isHttpError(responsePayload.statusCode)) {
    logger.debug({ message: "\"statusCode\" in the payload is not a valid error code" });
    throw TypeError("NOT AN ERROR Http StatusCode");
  }
};
