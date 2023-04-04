import { BusinessOperations } from "../../../../../src/configuration/business-operations/business-operations-type.js";

export const schemaBop : BusinessOperations = {
  name: "schema-bop",
  input: {
    aCar: { type: "cloudedObject", required: true },
  },
  output: {},
  constants: [
    { name: "numericThree", type: "number", value: 3 },
    { name: "numericEight", type: "number", value: 8 },
    { name: "zero", type: "number", value: 0 },
    { name: "targetValue", type: "number", value: 5093 },
  ],
  variables: [],
  configuration: [
    {
      moduleName: "insert",
      modulePackage: "car",
      moduleType: "schemaFunction",
      key: 5,
      dependencies: [
        { origin: "inputs", originPath: "aCar", targetPath: "data" },
      ],
    },
    {
      moduleName: "find",
      modulePackage: "car",
      moduleType: "schemaFunction",
      key: 4,
      dependencies: [
        { origin: 5 },
        { origin: "inputs", originPath: "aCar.year", targetPath: "query.year.equal_to" },
      ],
    },
    {
      moduleName: "arrayAt",
      moduleType: "internal",
      key: 6,
      dependencies: [
        { origin: 4, originPath: "result.data", targetPath: "array" },
        { origin: "constants", originPath: "zero", targetPath: "index" },
      ],
    },
    {
      moduleName: "delete",
      moduleType: "schemaFunction",
      modulePackage: "car",
      key: 3,
      dependencies: [
        { origin: 6, originPath: "result.found.year", targetPath: "query.year.equal_to" },
      ],
    },
    {
      moduleName: "output",
      moduleType: "output",
      key: 6,
      dependencies: [
        { origin: 3, originPath: "result", targetPath: "output" },
      ],
    },
  ],
  customObjects: [],
};
