import { BusinessOperations } from "../../../../../src/configuration/business-operations/business-operations-type.js";

export const variableBop : BusinessOperations = {
  name: "variables",
  identifier: "",
  input: {
    aNumber: { type: "number", required: true },
    randomValue: { type: "any", required: true },
  },
  output: {},
  constants: [],
  variables: [
    { name: "numberVar", type: "number", initialValue: 15 },
    { name: "anyVar", type: "any" },
  ],
  configuration: [
    {
      moduleName: "setVariables",
      moduleType: "variable",
      key: 2,
      dependencies: [
        { origin: "inputs", originPath: "aNumber", targetPath: "numberVar" },
        { origin: "inputs", originPath: "randomValue", targetPath: "anyVar" },
      ],
    },
    {
      moduleName: "output",
      moduleType: "output",
      key: 1,
      dependencies: [
        { origin: "variables", originPath: "numberVar", targetPath: "initialValue" },
        { origin: 2, originPath: "result.setCount", targetPath: "functionOutput" },
        { origin: "variables", originPath: "numberVar", targetPath: "newValue" },
        { origin: "variables", originPath: "anyVar", targetPath: "randomItem" },
      ],
    },
  ],
  customObjects: [],
};
