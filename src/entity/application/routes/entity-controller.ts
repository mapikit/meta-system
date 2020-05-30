import { container } from "@api/infrastructure/container";
import { APIRouter } from "@api/common/types/api-router";
import { Router } from "express";
import { TYPES } from "@api/infrastructure/types";
import { EventManager } from "birbs";
import { MapikitResponse } from "@api/common/types/mapikit-response";
import { MapikitRequest } from "@api/common/types/mapikit-request";
import { logger } from "@api/mapikit/logger/logger";
import { EntityContext } from "@api/entity/domain/contexts/entity-context";
import { EntityInsertionRequest } from "@api/entity/application/request/entity-insertion";
import EntityManager from "@api/entity/application/entity-manager";
import { EntityState } from "@api/entity/domain/contexts/entity-context";
import { ContextCreationRequest } from "@api/entity/application/request/context-creation";
import { FailureResponseCodes } from "@api/common/enums/fail-response-codes";
import { ResponseMessages } from "@api/common/enums/response-messages";
import Http from "http-status-codes";
import { SetupContextResponse } from "@api/entity/domain/types/responses/response-payloads";

export class EntityController extends APIRouter {
  private manager : EventManager;
  public constructor (options : { EntityManager : EventManager }) {
    super("secure");
    this.manager = options.EntityManager;
    this.routeVersion = 1;

    this.insertEntity = this.insertEntity.bind(this);
    this.setupContext = this.setupContext.bind(this);
  }

  public entityEndpoints () : Router {
    return this.router
      .post(`${this.version}/insert`, this.transformController(
        EntityInsertionRequest,
        this.insertEntity,
      ))
      .post(`${this.version}/setup`, this.transformController(
        ContextCreationRequest,
        this.setupContext,
      ));;
  };

  // eslint-disable-next-line max-lines-per-function
  public async insertEntity (request : MapikitRequest, response : MapikitResponse) : Promise<void> {
    logger.debug({ message: `Received request: Entity Insertion - ${new Date()}` });
    this.setupResponseContext(response);
    try {
      this.manager
        .addBirbable(container.resolve(TYPES.InsertEntity), request.headers.clientId.toString())
        .broadcast({ birbable: container.resolve(TYPES.InsertEntity).constructor.name,
          context: request.headers.clientId.toString() }, {
          payload: request,
          identifier: response.identifier,
        });
    }
    catch {
      this.invalidContext(response);
    }
  };

  public async setupContext (request : MapikitRequest, response : MapikitResponse) : Promise<void> {
    logger.debug({ message: `Received request: Schemas Setup - ${new Date()}` });
    const context = new EntityContext({
      EntityManager : EntityManager,
      ClientIdentifier : request.headers.clientId.toString() });
    context.responseIdentifier = response.identifier;

    context.setContextState(this.buildStateFromRequest(request));
    this.setupResponseContext(response);
    this.manager.addContext(context);

    logger.debug({ message: "Created new context", state: context.contextState });
    context.setResponse<SetupContextResponse>({ data: { message: "Context Setup" }, statusCode: 201 });
  };



  private setupResponseContext (response : MapikitResponse) : void {
    this.manager
      .addContext(response)
      .addBirbable(container.resolve(TYPES.SetResponse), response.identifier)
      .addBirbable(container.resolve(TYPES.SetError), response.identifier);
  }

  private buildStateFromRequest (request : MapikitRequest) : EntityState {
    return {
      clientId: request.headers.clientId.toString(),
      clientEmail: request.headers.clientEmail.toString(),
      clientName: request.headers.clientName.toString(),
      clientUsername: request.headers.clientUsername.toString(),
      clientSchemas: request.clientSchemas,
    };
  }

  private invalidContext (response : MapikitResponse) : void{
    this.manager.broadcast({ birbable: "SetError", context: response.identifier }, {
      key: FailureResponseCodes.contextNotSetup,
      message: ResponseMessages.contextNotSetup,
      statusCode: Http.BAD_REQUEST,
    });
  }
};
