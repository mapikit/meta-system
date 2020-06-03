import { Request, Response, NextFunction } from "express";
import { FailureResponseCodes } from "@api/common/enums/fail-response-codes";
import { ResponseMessages } from "@api/common/enums/response-messages";
import * as Http from "http-status-codes";
import { decodeToken } from "@api/common/helpers/jwt-utils";
import jwt from "jsonwebtoken";
import { TokenClient } from "@api/entity/domain/types/authorized-client";

type ExpressRequest = (req : Request, res : Response, next : NextFunction) => Promise<void>;

export function Authorization () : ExpressRequest {
  return async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try {
      const token = decodeToken(req.headers.authorization);
      assignAuthorizationHeader(token, req.headers);
    } catch(err) {
      resolveError(res, err);
      return;
    }
    next();
  };
}

function resolveError (res : Response, err : jwt.JsonWebTokenError) : void {
  if(err instanceof jwt.TokenExpiredError) {
    tokenExpired(res);

    return;
  }
  if(err instanceof jwt.JsonWebTokenError) {
    tokenInvalid(res);

    return;
  }
  res.statusCode = Http.BAD_REQUEST; //TODO create default response for random "authorization "junk
  res.send({
    key: "MS666",
    message: "Corrupt Token. The Token had invalid type",
  });
}

function tokenExpired (res : Response) : void {
  res.statusCode = Http.UNAUTHORIZED;
  res.send({
    key : FailureResponseCodes.tokenExpired,
    message: ResponseMessages.tokenExpired,
  });
}

function tokenInvalid (res : Response) : void {
  res.statusCode = Http.UNAUTHORIZED;
  res.send({
    key : FailureResponseCodes.tokenInvalid,
    message: ResponseMessages.tokenInvalid,
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assignAuthorizationHeader (token : TokenClient, headers : any) : void {
  headers.clientId = token.clientId;
  headers.clientEmail = token.clientEmail;
  headers.clientName = token.clientName;
  headers.clientUsername = token.clientUsername;
}
