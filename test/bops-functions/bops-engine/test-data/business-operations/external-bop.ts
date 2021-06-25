import { BusinessOperations } from "@api/configuration/business-operations/business-operations-type";

export const externalBop : BusinessOperations = {
  name: "external-bop",
  input: {
    myName: { type: "string", required: true },
  },
  output: {},
  constants: [],
  configuration: [
    {
      moduleRepo: ":bops-function-hello-world",
      key: 6,
      dependencies: [
        { origin: "inputs", originPath: "myName", targetPath: "nameToGreet" },
      ],
    },
    {
      moduleRepo: "%output",
      key: 3,
      dependencies: [
        { origin: 6, originPath: "result.customGreetings", targetPath: "wasGreeted" },
        { origin: 6, originPath: "result.greetingsMade", targetPath: "greetings" },
      ],
    },
  ],
  customObjects: [],
};
