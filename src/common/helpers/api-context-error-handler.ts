import { ResponseMessages } from "@api/common/enums/response-messages";
import { FailureResponseCodes } from "@api/common/enums/fail-response-codes";
import { logger } from "@api/mapikit/logger/logger";

export function apiErrorHandler (error : Error) : void {
  logger.error({ message: error.message, errorStack: error.stack });
  this.setError({
    statusCode: 500,
    message: ResponseMessages.internalServerError,
    key: FailureResponseCodes.internalServerError,
  });
};
