import { SchemasType } from "@api/configuration/schemas/schemas-type";

export const complexExampleSchema : SchemasType = {
  name: "exampleComplexSchema",
  format: {
    name: { type: "string" },
    hobbies: {
      type: "array",
      subtype: "string",
    },
    acquaintances: {
      type: "array",
      subtype: {
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
