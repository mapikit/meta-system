import { MapikitCommandContext } from "@api/mapikit/contexts/command-context";
import { TokenClient } from "@api/entity/domain/types/authorized-client";
import { EventManager } from "birbs";
import { apiErrorHandler } from "@api/common/helpers/api-context-error-handler";

export interface EntityState extends TokenClient {
  entityName ?: string; //TODO remove/change this placeholder
}

export class EntityContext extends MapikitCommandContext<EntityState> {

  public constructor (options : {
    EntityManager : EventManager; })
  {
    super({ identifier: Symbol("EntityContext") });
    this.errorHandler = apiErrorHandler.bind(this);
    this.manager = options.EntityManager;
  }
};
