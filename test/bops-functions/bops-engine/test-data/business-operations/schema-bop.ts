import { BusinessOperations } from "@api/configuration/business-operations/business-operations-type";

export const schemaBop : BusinessOperations = {
  name: "schema-bop",
  input: {
    aCar: { type: "cloudedObject", required: true },
  },
  output: {},
  constants: [
    { name: "numericThree", type: "number", value: 3 },
    { name: "numericEight", type: "number", value: 8 },
    { name: "targetValue", type: "number", value: 5093 },
  ],
  configuration: [
    {
      moduleRepo: "@car@create",
      key: 5,
      dependencies: [
        { origin: "inputs", originPath: "aCar", targetPath: "entity" },
      ],
    },
    {
      moduleRepo: "@car@getById",
      key: 4,
      dependencies: [
        { origin: 5, originPath: "result.createdEntity._id", targetPath: "id" },
      ],
    },
    {
      moduleRepo: "@car@delete",
      key: 3,
      dependencies: [
        { origin: 4, originPath: "result.entity.year", targetPath: "query.year.equal_to" },
      ],
    },
    {
      moduleRepo: "%output",
      key: 6,
      dependencies: [
        { origin: 3, originPath: "result", targetPath: "output" },
      ],
    },
  ],
  customObjects: [],
};
