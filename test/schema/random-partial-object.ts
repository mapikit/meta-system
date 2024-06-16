import { CloudedObject } from "../../src/common/types/clouded-object.js";
import { SchemaType } from "../../src/configuration/schemas/schemas-type.js";
import { entityFactory } from "../factories/entity-factory.js";
import { faker } from "@faker-js/faker";

export const randomPartialObject = (fromSchema : SchemaType) : CloudedObject => {
  const resultObject : CloudedObject = {};
  const computedEntity = entityFactory(fromSchema.format);

  for (const propertyName in computedEntity) {
    if (faker.datatype.boolean()) {
      resultObject[propertyName] = computedEntity[propertyName];
    }
  }

  return resultObject;
};
