import faker from "faker";
import { SchemaAttributes } from "@api/entity/domain/types/schema-attributes";
import { SchemaField } from "@api/entity/domain/types/schema-field-attributes";
import { JsonType } from "@api/common/types/json-types";


export const schemaFactory = (predefined : Partial<SchemaAttributes>) : SchemaAttributes => {
  const now = new Date();

  const creationInput : SchemaAttributes = {
    schemaId: predefined.schemaId || faker.random.uuid(),
    name: predefined.name || faker.name.title(),
    collectionLocation: predefined.collectionLocation || faker.database.column(),
    parentEntity: predefined.parentEntity || faker.random.uuid(),
    schema: predefined.schema || fakeSchemaField(),
    clientId : predefined.clientId || faker.random.uuid(),
    createdAt: predefined.createdAt || now,
    updatedAt: predefined.updatedAt || now,
  };

  return creationInput;
};

export const fakeSchemaField = () : SchemaField[] => {
  const jsonTypes : JsonType[] = ["string", "boolean", "integer", "number"];
  const field = {
    fieldName: faker.database.column(),
    fieldType: faker.helpers.randomize(jsonTypes),
    nullable: faker.helpers.randomize([true, false]),
    readonly: faker.helpers.randomize([true, false]),
  };
  return [field];
};
