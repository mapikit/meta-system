import { EntityInsertionRequest } from "@api/entity/application/request/entity-insertion";
import { entityFactory } from "@test/factories/entity-factory";
import { schemaFactory } from "@test/factories/schema-factory";

export const entityInsertionRequestFactory = (options : Partial<EntityInsertionRequest>) : EntityInsertionRequest => {

  return new EntityInsertionRequest({ body: {
    schema: schemaFactory(options.schema),
    entity: entityFactory(options.entity),
  } });
};
