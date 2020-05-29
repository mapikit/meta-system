import { MapikitCommandContext } from "@api/mapikit/contexts/command-context";
import { TokenClient } from "@api/entity/domain/types/authorized-client";
import { EventManager } from "birbs";
import { apiErrorHandler } from "@api/common/helpers/api-context-error-handler";
import { SchemaAttributes } from "@api/entity/domain/types/schema-attributes";

export interface EntityState extends TokenClient {
  clientSchemas : SchemaAttributes[];
}

export class EntityContext extends MapikitCommandContext<EntityState> {

  public constructor (options : {
    EntityManager : EventManager;
    ClientIdentifier : string;
  })
  {
    super({ identifier: options.ClientIdentifier });
    this.errorHandler = apiErrorHandler.bind(this);
    this.manager = options.EntityManager;
  }
};
