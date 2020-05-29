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
import { ManagerRoutineInfo } from "@api/common/types/manager-routine-info";
import EntityManager from "@api/entity/application/entity-manager";
import { EntityState } from "@api/entity/domain/contexts/entity-context";
import { ContextCreationRequest } from "@api/entity/application/request/context-creation";

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

    this.manager
      .addContext(response)
      .addBirbable(container.resolve(TYPES.SetResponse), response.identifier)
      .addBirbable(container.resolve(TYPES.SetError), response.identifier)
      .addBirbable(container.resolve(TYPES.InsertEntity), request.headers.clientId.toString())
      .broadcast({ birbable: container.resolve(TYPES.InsertEntity).constructor.name, context: request.headers.clientId.toString() }, {
        payload: request,
        identifier: response.identifier,
      });
  };

  // eslint-disable-next-line max-lines-per-function
  public async setupContext (request : MapikitRequest, response : MapikitResponse) : Promise<void> {
    logger.debug({ message: `Received request: Schemas Setup - ${new Date()}` });
    const context = new EntityContext({
      EntityManager : EntityManager,
      ClientIdentifier : request.headers.clientId.toString() });
    context.responseIdentifier = response.identifier;

    context.setContextState(this.buildStateFromRequest(request));
    this.manager
      .addContext(context);
    logger.debug({
      message: "Created new context",
      contextIdentifier: request.headers.clientId,
      state: context.contextState });
    response.response.send("Success");

  };




  private runManagerRoutine (info : ManagerRoutineInfo) : void {
    this.manager.addContext(info.response)
      .addContext(info.context)
      .addBirbable(container.resolve(TYPES.SetResponse), info.response.identifier)
      .addBirbable(container.resolve(TYPES.SetError), info.response.identifier)
      .addBirbable(info.birbable, info.context.identifier)
      .broadcast({ birbable: info.birbable.constructor.name, context: info.context.identifier }, {
        payload: info.request,
        identifier: info.response.identifier,
      });
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
};
