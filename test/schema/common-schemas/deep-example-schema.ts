import { SchemaType } from "../../../src/configuration/schemas/schemas-type";

export const deepExampleSchema : SchemaType = {
  name: "exampleDeepSchema",
  format: {
    name: { type: "string" },
    job: {
      type: "object",
      subtype: {
        wage: { type: "number" },
        name: { type: "string" },
        hiredAt: { type: "date" },
      },
    },
  },
  identifier: "someIdentifier",
  dbProtocol: "aDbProtocol",
};
