import { BusinessOperations } from "@api/configuration-de-serializer/domain/business-operations-type";

export const bopception : BusinessOperations = {
  name: "bopception",
  inputs: [],
  outputs: [],
  route: "/cars/:carId/sell",
  constants: [
    { name: "randomString", type: "string", value: "asdfoo" },
  ],
  configuration: [
    {
      moduleRepo: "+prebuilt-functions",
      key: 1,
      inputsSource: [],
      nextFunctions: [
        { nextKey: 2, branch: "default" },
      ],
    },
    {
      moduleRepo: "%bops-function-hello-world",
      key: 2,
      inputsSource: [
        { source: 1, sourceOutput: "results.4.result", target: "nameToGreet" },
      ],
      nextFunctions: [
        { nextKey: 3, branch: "default" },
      ],
    },
    {
      moduleRepo: "+external-functions",
      key: 3,
      inputsSource: [
        { source: "!randomString", target: "inputs.externalInput" },
      ],
      nextFunctions: [
        { branch: "default", nextKey: 4 },
      ],
    },
    {
      moduleRepo: "+timeout",
      key: 4,
      inputsSource: [],
      nextFunctions: [
        { branch: "errorBranch", nextKey: 5 },
        { branch: "default", nextKey: 5 },
      ],
    },
    { //This should not be executed since previous module fails
      moduleRepo: "%bops-function-hello-world",
      key: 5,
      inputsSource: [
        { source: 3, sourceOutput: "executionError.errorMessage", target : "nameToGreet" },
      ],
      nextFunctions: [],
    },
  ],
  usedAsRoute: true,
  customObjects: [],
};
