import { CloudedObject } from "../../src/common/types/clouded-object";
import { SchemaType } from "../../src/configuration/schemas/schemas-type";
import { entityFactory } from "../factories/entity-factory";
import { random } from "faker";

export const randomPartialObject = (fromSchema : SchemaType) : CloudedObject => {
  const resultObject : CloudedObject = {};
  const computedEntity = entityFactory(fromSchema.format);

  for (const propertyName in computedEntity) {
    if (random.boolean) {
      resultObject[propertyName] = computedEntity[propertyName];
    }
  }

  return resultObject;
};
