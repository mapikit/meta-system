import { BusinessOperations } from "../../../../../src/configuration/business-operations/business-operations-type.js";

export const mapikitProvidedBop : BusinessOperations = {
  identifier: "prebuilt-functions",
  input: {
    aNumber: { type: "number", required: true },
  },
  output: {},
  constants: [
    { name: "numericThree", type: "number", value: 3 },
    { name: "numericEight", type: "number", value: 8 },
    { name: "targetValue", type: "number", value: 5093 },
  ],
  variables: [],
  configuration: [
    {
      moduleName: "exponential",
      moduleType: "internal",
      key: 5,
      dependencies: [
        { origin: "constants", originPath: "numericThree", targetPath: "A" },
        { origin: "inputs", originPath: "aNumber", targetPath: "B" },
      ],
    },
    {
      moduleName: "output",
      moduleType: "output",
      key: 6,
      dependencies: [
        { origin: 5, originPath: "result.result", targetPath: "output" },
      ],
    },
  ],
};
