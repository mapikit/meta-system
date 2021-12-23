import { SchemaType } from "../../../src/configuration/schemas/schemas-type";

export const multipleTypesSchema : SchemaType = {
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
  identifier: "someIdentifier",
  dbProtocol: "aDbProtocol",
};
