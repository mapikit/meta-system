import { BusinessOperations } from "../../../../../src/configuration/business-operations/business-operations-type.js";

export const externalBop : BusinessOperations = {
  name: "external-bop",
  input: {
    myName: { type: "string", required: true },
  },
  output: {},
  constants: [],
  variables: [],
  configuration: [
    {
      version: "latest",
      moduleName: "bops-function-hello-world",
      moduleType: "external",
      key: 6,
      dependencies: [
        { origin: "inputs", originPath: "myName", targetPath: "nameToGreet" },
      ],
    },
    {
      moduleName: "output",
      moduleType: "output",
      key: 3,
      dependencies: [
        { origin: 6, originPath: "result.customGreetings", targetPath: "wasGreeted" },
        { origin: 6, originPath: "result.greetingsMade", targetPath: "greetings" },
      ],
    },
  ],
  customObjects: [],
};
