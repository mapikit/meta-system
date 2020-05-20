import { container } from "@api/infrastructure/container";
import { APIRouter } from "@api/common/types/api-router";
import { Router } from "express";
import { TYPES } from "@api/infrastructure/types";
import { EventManager } from "birbs";
import { MapikitResponse } from "@api/common/types/mapikit-response";
import { MapikitRequest } from "@api/common/types/mapikit-request";
import { logger } from "@api/mapikit/logger/logger";
import { SchemaCreationRequest } from "@api/entity/application/request/schema-creation";
import { SchemaContext, SchemaState } from "@api/entity/domain/contexts/schema-context";
import { SchemaSearchRequest } from "@api/entity/application/request/schema-search";
import { ManagerRoutineInfo } from "@api/common/types/manager-routine-info";

export class ClientSchemaController extends APIRouter {
  private manager : EventManager;
  public constructor (options : { SchemaManager : EventManager }) {
    super("secure");
    this.manager = options.SchemaManager;
    this.routeVersion = 1;

    this.createSchema = this.createSchema.bind(this);
    this.searchSchema = this.searchSchema.bind(this);
    this.getSchemas = this.getSchemas.bind(this);
  }

  public schemaEndpoints () : Router {
    return this.router
      .post(`${this.version}/create`, this.transformController(
        SchemaCreationRequest,
        this.createSchema,
      ))
      .get(`${this.version}/:schemaId`, this.transformController(
        SchemaSearchRequest,
        this.searchSchema,
      ))
      .get(`${this.version}`, this.transformController(
        MapikitRequest,
        this.getSchemas,
      ));
  };

  public async createSchema (request : MapikitRequest, response : MapikitResponse) : Promise<void> {
    logger.debug({ message: `Received request: Schema Creation - ${new Date()}` });
    const context = container.resolve<SchemaContext>(TYPES.SchemaContext);
    context.responseIdentifier = response.identifier;

    this.runManagerRoutine({
      request: request,
      response: response,
      birbable: container.resolve(TYPES.CreateSchema),
      context: context,
    });
  };

  public async searchSchema (request : MapikitRequest, response : MapikitResponse) : Promise<void> {
    logger.debug({ message: `Received request: Schema Search - ${new Date()}` });
    const context = container.resolve<SchemaContext>(TYPES.SchemaContext);
    context.responseIdentifier = response.identifier;

    this.runManagerRoutine({
      request: request,
      response: response,
      birbable: container.resolve(TYPES.SearchSchema),
      context: context,
    });
  };

  public async getSchemas (request : MapikitRequest, response : MapikitResponse) : Promise<void> {
    logger.debug({ message: `Received request: Get Schemas - ${new Date()}` });
    const context = container.resolve<SchemaContext>(TYPES.SchemaContext);
    context.responseIdentifier = response.identifier;

    this.runManagerRoutine({
      request: request,
      response: response,
      birbable: container.resolve(TYPES.GetSchemas),
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
        schemaState: this.buildStateFromHeaders(info.request.headers),
      });
  }

  private buildStateFromHeaders (headers : any) : SchemaState {
    return {
      clientId: headers.clientId,
      clientEmail: headers.clientEmail,
      clientName: headers.clientName,
      clientUsername: headers.clientUsername,
    };
  }
};
