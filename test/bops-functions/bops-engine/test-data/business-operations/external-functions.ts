import { BusinessOperations } from "@api/configuration-de-serializer/domain/business-operations-type";

export const externalFunctionsBop : BusinessOperations = {
  name: "external-functions",
  inputs: [
    { name: "externalInput", type: "string" },
  ],
  outputs: [],
  route: "/cars/:carId/sell",
  constants: [
    { name: "randomName", type: "string", value: "Joseph" },
    { name: "numericEight", type: "number", value: 8 },
  ],
  configuration: [
    {
      moduleRepo: "%bops-function-hello-world",
      key: 1,
      inputsSource: [
        { source: "!randomName", target: "nameToGreet" },
      ],
      nextFunctions: [
        { nextKey: 2, branch: "default" },
      ],
    },
    {
      moduleRepo: "%bops-function-hello-world",
      key: 2,
      inputsSource: [
        { source: "!numericEight", target: "nameToGreet" },
      ],
      nextFunctions: [
        { nextKey: 3, branch: "default" },
      ],
    },
    {
      moduleRepo: "%bops-function-hello-world",
      key: 3,
      inputsSource: [
        { source: "!externalInput", target: "nameToGreet" },
      ],
      nextFunctions: [],
    },
  ],
  usedAsRoute: true,
  customObjects: [],
};
