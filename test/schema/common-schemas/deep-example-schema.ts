import { SchemasType } from "@api/configuration/schemas/schemas-type";

export const deepExampleSchema : SchemasType = {
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
};
