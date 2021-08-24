import { BusinessOperations } from "../../../../../src/configuration/business-operations/business-operations-type";

export const variableBop : BusinessOperations = {
  name: "variables",
  input: {
    aNumber: { type: "number", required: true },
  },
  output: {},
  constants: [],
  variables: [
    { name: "numberVar", type: "number", initialValue: 15 },
  ],
  configuration: [
    {
      moduleRepo: "setVariables",
      moduleType: "variable",
      key: 2,
      dependencies: [
        { origin: "inputs", originPath: "aNumber", targetPath: "numberVar" },
      ],
    },
    {
      moduleRepo: "output",
      moduleType: "output",
      key: 1,
      dependencies: [
        { origin: "variables", originPath: "numberVar", targetPath: "initialValue" },
        { origin: 2, originPath: "result.setCount", targetPath: "functionOutput" },
        { origin: "variables", originPath: "numberVar", targetPath: "newValue" },
      ],
    },
  ],
  customObjects: [],
};
