import { container } from "@api/infrastructure/container";
import { APIRouter } from "@api/common/types/api-router";
import { Router } from "express";
import { TYPES } from "@api/infrastructure/types";
import { EventManager } from "birbs";
import { MapikitResponse } from "@api/common/types/mapikit-response";
import { MapikitRequest } from "@api/common/types/mapikit-request";
import { logger } from "@api/mapikit/logger/logger";
import { EntityContext, EntityState } from "@api/entity/domain/contexts/entity-context";
import { EntityInsertionRequest } from "@api/entity/application/request/entity-insertion";
import { ManagerRoutineInfo } from "@api/common/types/manager-routine-info";

export class EntityController extends APIRouter {
  private manager : EventManager;
  public constructor (options : { EntityManager : EventManager }) {
    super("secure");
    this.manager = options.EntityManager;
    this.routeVersion = 1;

    this.insertEntity = this.insertEntity.bind(this);
  }

  public entityEndpoints () : Router {
    return this.router
      .post(`${this.version}/insert`, this.transformController(
        EntityInsertionRequest,
        this.insertEntity,
      ));
  };

  public async insertEntity (request : MapikitRequest, response : MapikitResponse) : Promise<void> {
    logger.debug({ message: `Received request: Entity Insertion - ${new Date()}` });
    const context = container.resolve<EntityContext>(TYPES.EntityContext);
    context.responseIdentifier = response.identifier;

    this.runManagerRoutine({
      request: request,
      response: response,
      birbable: container.resolve(TYPES.InsertEntity),
      context: context,
    });
  };

  private runManagerRoutine (info : ManagerRoutineInfo) : void {
    info.context.setContextState(this.buildStateFromHeaders(info.request.headers));
    this.manager.addContext(info.response)
      .addContext(info.context)
      .addBirbable(container.resolve(TYPES.SetResponse), info.response.identifier)
      .addBirbable(container.resolve(TYPES.SetError), info.response.identifier)
      .addBirbable(info.birbable, info.context.identifier)
      .broadcast({ birbable: info.birbable.constructor.name, context: info.context.identifier }, {
        payload: info.request,
        identifier: info.response.identifier,
        entityState: this.buildStateFromHeaders(info.request.headers),
      });
  }

  private buildStateFromHeaders (headers : any) : EntityState {
    return {
      clientId: headers.clientId,
      clientEmail: headers.clientEmail,
      clientName: headers.clientName,
      clientUsername: headers.clientUsername,
    };
  }
};
