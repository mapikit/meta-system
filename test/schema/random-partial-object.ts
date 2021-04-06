import { CloudedObject } from "@api/common/types/clouded-object";
import { SchemasType } from "@api/configuration-de-serializer/domain/schemas-type";
import { entityFactory } from "@test/factories/entity-factory";
import { random } from "faker";

export const randomPartialObject = (fromSchema : SchemasType) : CloudedObject => {
  const resultObject : CloudedObject = {};
  const computedEntity = entityFactory(fromSchema.format);

  for (const propertyName in computedEntity) {
    if (random.boolean) {
      resultObject[propertyName] = computedEntity[propertyName];
    }
  }

  return resultObject;
};
