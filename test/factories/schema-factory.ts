import { SchemaType } from "../../src/configuration/schemas/schemas-type.js";
import { faker } from "@faker-js/faker";
import { schemaFormatFactory } from "./schema-format-factory.js";

export const schemaFactory = (predefined : Partial<SchemaType>) : SchemaType => {

  const creationInput : SchemaType = {
    name: predefined.name ?? faker.person.jobArea(),
    format : predefined.format ?? schemaFormatFactory(),
    identifier : predefined.identifier ?? faker.string.alphanumeric(8),
  };

  return creationInput;
};
