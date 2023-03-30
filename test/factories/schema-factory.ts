import { SchemaType } from "../../src/configuration/schemas/schemas-type.js";
import faker from "faker";
import { schemaFormatFactory } from "./schema-format-factory";


export const schemaFactory = (predefined : Partial<SchemaType>) : SchemaType => {

  const creationInput : SchemaType = {
    name: predefined.name ?? faker.name.jobArea(),
    format : predefined.format ?? schemaFormatFactory(),
    dbProtocol : predefined.dbProtocol ?? faker.random.alphaNumeric(5),
    identifier : predefined.identifier ?? faker.random.alphaNumeric(8),
  };

  return creationInput;
};
