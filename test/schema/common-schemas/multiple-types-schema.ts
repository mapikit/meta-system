import { SchemasType } from "@api/configuration-de-serializer/domain/schemas-type";

export const multipleTypesSchema : SchemasType = {
  name: "exampleFlatSchema",
  format: {
    name: { type: "string" },
    age: { type: "number" },
    birthDate: { type: "date" },
    isRegistered: { type: "boolean" },
    hobbies: {
      type: "array",
      data: "string",
    },
    luckyNumbers: {
      type: "array",
      data: "number",
    },
    familyBirthdays: {
      type: "array",
      data: "date",
    },
    secretBoolSequence: {
      type: "array",
      data: "boolean",
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
