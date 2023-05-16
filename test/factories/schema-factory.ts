import { SchemaType } from "../../src/configuration/schemas/schemas-type.js";
import faker from "faker";
import { schemaFormatFactory } from "./schema-format-factory.js";


export const schemaFactory = (predefined : Partial<SchemaType>) : SchemaType => {

  const creationInput : SchemaType = {
    name: predefined.name ?? faker.name.jobArea(),
    format : predefined.format ?? schemaFormatFactory(),
    identifier : predefined.identifier ?? faker.random.alphaNumeric(8),
  };

  return creationInput;
};
