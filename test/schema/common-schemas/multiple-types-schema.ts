import { SchemasType } from "@api/configuration/schemas/schemas-type";

export const multipleTypesSchema : SchemasType = {
  name: "exampleFlatSchema",
  format: {
    name: { type: "string" },
    age: { type: "number" },
    birthDate: { type: "date" },
    isRegistered: { type: "boolean" },
    hobbies: {
      type: "array",
      subtype: "string",
    },
    luckyNumbers: {
      type: "array",
      subtype: "number",
    },
    familyBirthdays: {
      type: "array",
      subtype: "date",
    },
    secretBoolSequence: {
      type: "array",
      subtype: "boolean",
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
