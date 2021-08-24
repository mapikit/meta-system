import { BusinessOperations } from "../../../src/configuration/business-operations/business-operations-type";

export const cronjobBop : BusinessOperations = {
  name: "cronjob-bop",
  input: {
    model: {  type: "string", required: true },
    year: {  type: "number", required: true },
  },
  output: {},
  constants: [
    { name: "varName", type: "string", value: "If this was printed 5 times, cronjob is nominal" },
  ],
  variables: [],
  configuration: [
    {
      moduleType: "external",
      modulePackage: "logger-meta-functions",
      moduleRepo: "infoLog",
      key: 2,
      dependencies: [
        { origin: "constants", originPath: "varName", targetPath: "message" },
      ],
    },
    {
      moduleRepo: "output",
      moduleType: "output",
      key: 1,
      dependencies: [
        { origin: 2 },
      ],
    },
  ],
  customObjects: [],
};
