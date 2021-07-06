import { SchemasType } from "../../src/configuration/schemas/schemas-type";
import faker from "faker";
import { schemaFormatFactory } from "./schema-format-factory";


export const schemaFactory = (predefined : Partial<SchemasType>) : SchemasType => {

  const creationInput : SchemasType = {
    name: predefined.name ?? faker.name.jobArea(),
    format : predefined.format ?? schemaFormatFactory(),
  };

  return creationInput;
};
