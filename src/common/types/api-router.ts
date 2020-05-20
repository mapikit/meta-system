import { Router, Request, Response } from "express";
import { ControllerFunction } from "@api/common/types/controller-function";
import { MapikitRequest } from "./mapikit-request";
import { FailureResponseCodes } from "@api/common/enums/fail-response-codes";
import { MapikitResponse } from "@api/common/types/mapikit-response";
import { MapikitErrorPayload } from "@api/common/response/error-payload";
import { ResponseMessages } from "@api/common/enums/response-messages";
import * as Http from "http-status-codes";
import { Authorization } from "@api/common/middlewares/authorization";
import { SetError } from "@api/common/procedures/set-error";
import { isValidClass } from "@api/common/class-validation";
type ExpressRequest = (req : Request, res : Response) => Promise<void>;
export abstract class APIRouter {
  public readonly router : Router = Router();
  protected readonly validationLimit : number = 0;
  protected routeVersion ?: string | number;
  protected middlewares = []

  public constructor (routeSecurity : "secure" | "insecure" = "insecure") {
    if(routeSecurity === "secure")
      this.middlewares.push(Authorization());
    if(this.middlewares.length)
      this.router.use(this.middlewares);
  }

  protected get version () : string {
    return this.routeVersion === undefined ? "" : `/v${this.routeVersion}`;
  }

  protected transformController (
    requestType : new(req : Request) => MapikitRequest,
    controllerFunction :  ControllerFunction,
  ) : ExpressRequest {
    return async (req : Request, res : Response) : Promise<void> => {
      const request = new requestType(req);
      const response = new MapikitResponse(res);
      if ((await isValidClass(request)).length > this.validationLimit) {
        response.sign(new SetError());
        response.trigger({ birbable: "SetError" }, this.getErrorPayload());
        return;
      }

      await controllerFunction(request, response);
    };
  }

  private getErrorPayload () : MapikitErrorPayload {
    return {
      key: FailureResponseCodes.invalidRequest,
      message: ResponseMessages.invalidRequest,
      statusCode: Http.BAD_REQUEST,
    };
  }
};
