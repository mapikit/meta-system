import faker from "faker";
import { EntityInsertionRequest } from "@api/entity/application/request/entity-insertion";
import { entityFactory } from "@test/factories/entity-factory";

export const entityInsertionRequestFactory = (options : Partial<EntityInsertionRequest>) : EntityInsertionRequest => {

  return new EntityInsertionRequest({ body: {
    schemaId: options.schemaId ?? faker.random.uuid(),
    entity: entityFactory(options.entity),
  } });
};
