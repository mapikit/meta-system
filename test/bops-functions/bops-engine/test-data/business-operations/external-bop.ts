import { BusinessOperations } from "../../../../../src/configuration/business-operations/business-operations-type";

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
      version: "1.1.1",
      moduleRepo: "bops-function-hello-world",
      moduleType: "external",
      key: 6,
      dependencies: [
        { origin: "inputs", originPath: "myName", targetPath: "nameToGreet" },
      ],
    },
    {
      moduleRepo: "output",
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
