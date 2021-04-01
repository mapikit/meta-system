import { SchemasType } from "@api/configuration-de-serializer/domain/schemas-type";

export const complexExampleSchema : SchemasType = {
  name: "exampleComplexSchema",
  format: {
    name: { type: "string" },
    hobbies: {
      type: "array",
      data: "string",
    },
    acquaintances: {
      type: "array",
      data: {
        name: { type: "string" },
        gender: { type: "string" },
        age: { type: "number" },
      },
    },
  },
  routes: {
    getMethodEnabled: false,
    postMethodEnabled: false,
    deleteMethodEnabled: false,
    patchMethodEnabled: false,
    putMethodEnabled: false,
    queryParamsGetEnabled: false,
  },
};
