import { SchemaType } from "../../../src/configuration/schemas/schemas-type.js";

export const complexExampleSchema : SchemaType = {
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
  identifier: "someIdentifier",
  dbProtocol: "aDbProtocol",
};
