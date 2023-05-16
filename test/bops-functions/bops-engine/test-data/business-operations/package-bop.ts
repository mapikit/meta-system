import { BusinessOperations } from "../../../../../src/configuration/business-operations/business-operations-type.js";

export const packageBop : BusinessOperations = {
  identifier: "package-bop",
  input: {
    age: { type: "number", required: true },
  },
  output: {},
  constants: [
    { name: "adulthood", type: "number", value: 18 },
    { name: "isOlder", type: "string", value: "Is older than 18." },
    { name: "isNotOlder", type: "string", value: "Is not older than 18." },
    { name: "trueConst", type: "boolean", value: true },
  ],
  variables: [
    { name: "isAdult", type: "boolean", initialValue: false },
  ],
  configuration: [
    {
      moduleType: "internal",
      moduleName: "lowerThan",
      key: 1,
      dependencies: [
        { origin: "inputs", originPath: "age", targetPath: "A" },
        { origin: "constants", originPath: "adulthood", targetPath: "B" },
      ],
    },
    {
      moduleType: "internal",
      moduleName: "if",
      key: 2,
      dependencies: [
        { origin: 1, originPath: "result.isLower", targetPath: "boolean" },
        { origin: 6, originPath: "module", targetPath: "ifTrue" },
        { origin: 4, originPath: "module", targetPath: "ifFalse" },
      ],
    },
    {
      moduleType: "variable",
      moduleName: "setVariables",
      key: 4,
      dependencies: [
        { origin: "constants", originPath: "trueConst", targetPath: "isAdult" },
      ],
    },
    {
      moduleType: "addon",
      modulePackage: "logger-meta-functions",
      moduleName: "warnLog",
      key: 6,
      dependencies: [
        { origin: "constants", originPath: "isNotOlder", targetPath: "message" },
      ],
    },
    {
      moduleName: "output",
      moduleType: "output",
      key: 3,
      dependencies: [
        { origin: 2 },
        { origin: "variables", originPath: "isAdult", targetPath: "over18" },
      ],
    },
  ],
};
