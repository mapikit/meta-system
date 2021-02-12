import faker from "faker";
import { SchemasType } from "@api/configuration-de-serializer/domain/schemas-type";
import { schemaFormatFactory } from "./schema-format-factory";


export const schemaFactory = (predefined : Partial<SchemasType>) : SchemasType => {

  const creationInput : SchemasType = {
    name: predefined.name ?? faker.name.jobArea(),
    routes: {
      getMethodEnabled: predefined.routes?.getMethodEnabled ?? faker.random.boolean(),
      postMethodEnabled: predefined.routes?.postMethodEnabled ?? faker.random.boolean(),
      putMethodEnabled: predefined.routes?.postMethodEnabled ?? faker.random.boolean(),
      patchMethodEnabled: predefined.routes?.postMethodEnabled ?? faker.random.boolean(),
      deleteMethodEnabled: predefined.routes?.postMethodEnabled ?? faker.random.boolean(),
      queryParamsGetEnabled: predefined.routes?.postMethodEnabled ?? faker.random.boolean(),
    },
    format : predefined.format ?? schemaFormatFactory(),
  };

  return creationInput;
};
