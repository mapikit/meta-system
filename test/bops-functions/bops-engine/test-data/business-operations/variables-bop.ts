import { BusinessOperations } from "../../../../../src/configuration/business-operations/business-operations-type";

export const variableBop : BusinessOperations = {
  name: "variables",
  input: {
    aNumber: { type: "number", required: true },
  },
  output: {},
  constants: [
    { name: "varName", type: "string", value: "numberVar" },
  ],
  variables: [
    { name: "numberVar", type: "number", initialValue: 15 },
  ],
  configuration: [
    {
      moduleRepo: "=setVariable",
      key: 2,
      dependencies: [
        { origin: "constants", originPath: "varName", targetPath: "variableName" },
        { origin: "inputs", originPath: "aNumber", targetPath: "value" },
      ],
    },
    {
      moduleRepo: "%output",
      key: 1,
      dependencies: [
        { origin: "variables", originPath: "numberVar", targetPath: "initialValue" },
        { origin: 2, originPath: "result.newValue", targetPath: "functionOutput" },
        { origin: "variables", originPath: "numberVar", targetPath: "newValue" },
      ],
    },
  ],
  customObjects: [],
};
