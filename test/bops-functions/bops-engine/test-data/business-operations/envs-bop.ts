import { BusinessOperationType } from "../../../../../src/configuration/business-operations/business-operations-type.js";

export const envBop : BusinessOperationType = {
  identifier: "env-bop",
  input: {},
  output: {},
  constants: [],
  variables: [],
  configuration: [
    {
      moduleName: "output",
      moduleType: "output",
      key: 3,
      dependencies: [
        { origin: "env", originPath: "testEnv", targetPath: "output" },
      ],
    },
  ],
};
