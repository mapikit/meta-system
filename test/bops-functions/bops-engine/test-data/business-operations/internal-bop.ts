import { BusinessOperations } from "../../../../../src/configuration/business-operations/business-operations-type";

export const internalBop : BusinessOperations = {
  name: "internal-bop",
  input: {},
  output: {},
  constants: [
    { name: "three", type: "number", value: 3 },
    { name: "eight", type: "number", value: 8 },
    { name: "four", type: "number", value: 4 },
  ],
  variables: [],
  configuration: [
    {
      moduleRepo: "prebuilt-functions",
      moduleType: "bop",
      key: 5,
      dependencies: [
        { origin: "constants", originPath: "four", targetPath: "aNumber" },
      ],
    },
    {
      moduleRepo: "subtract",
      moduleType: "internal",
      key: 6,
      dependencies: [
        { origin: 5, originPath: "result.output", targetPath: "A" },
        { origin: "constants", originPath: "eight", targetPath: "B" },
      ],
    },
    {
      moduleRepo: "output",
      moduleType: "output",
      key: 3,
      dependencies: [
        { origin: 6, originPath: "result.result", targetPath: "output" },
      ],
    },
  ],
  customObjects: [],
};
