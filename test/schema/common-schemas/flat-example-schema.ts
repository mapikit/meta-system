import { SchemaType } from "../../../src/configuration/schemas/schemas-type.js";

export const flatExampleSchema : SchemaType = {
  name: "exampleFlatSchema",
  format: {
    name: { type: "string" },
    age: { type: "number" },
    favoriteFood: { type: "string" },
    eyeColour: { type: "string" },
    height: { type: "number" },
  },
  identifier: "someIdentifier",
};
