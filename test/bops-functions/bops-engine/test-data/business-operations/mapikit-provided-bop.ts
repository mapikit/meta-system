import { BusinessOperations } from "@api/configuration-de-serializer/domain/business-operations-type";

export const mapikitProvidedBop : BusinessOperations = {
  name: "prebuilt-functions",
  inputs: [
    { name: "carId", type: "string", localization: "uri" },
    { name: "jsonBody", type: "$carSellBody", localization: "body" },
  ],
  outputs: [
    { name: "success", type: "string", "statusCode": 200 },
    { name: "systemFailure", type: "string", "statusCode": 500 },
  ],
  route: "/cars/:carId/sell",
  constants: [
    { name: "numericThree", type: "number", value: 3 },
    { name: "numericEight", type: "number", value: 8 },
    { name: "targetValue", type: "number", value: 5093 },
  ],
  configuration: [
    {
      moduleRepo: "#exponential",
      key: 1,
      inputsSource: [
        { source: "!numericThree", target: "A" },
        { source: "!numericEight", target: "B" },
      ],
      nextFunctions: [
        { nextKey: 2, branch: "result" },
      ],
    },
    {
      moduleRepo: "#subtract",
      key: 2,
      inputsSource: [
        { source: 1, target: "A", sourceOutput: "result" },
        { source: 3, target: "B", sourceOutput: "result" },
      ],
      nextFunctions: [
        { nextKey: 5, branch: "result" },
      ],
    },
    {
      moduleRepo: "#multiply",
      key: 3,
      inputsSource: [
        { source: "!numericThree", target: "numbersToMultiply[$source]" },
        { source: 4, target: "numbersToMultiply[$source]", sourceOutput: "result" },
      ],
      nextFunctions: [],
    },
    {
      moduleRepo: "#exponential",
      key: 4,
      inputsSource: [
        { source: "!numericThree", target: "B" },
        { source: "!numericEight", target: "A" },
      ],
      nextFunctions: [],
    },
    {
      moduleRepo: "#multiply",
      key: 5,
      inputsSource: [
        { source: 6, target: "numbersToMultiply[$source]", sourceOutput:"result" },
        { source: 7, target: "numbersToMultiply[$source]", sourceOutput:"result" },
      ],
      nextFunctions: [
        { nextKey: 9, branch: "result" },
      ],
    },
    {
      moduleRepo: "#add",
      key: 6,
      inputsSource: [
        { source: "!numericThree", target: "numbersToAdd[$source]" },
        { source: "!numericThree", target: "numbersToAdd[$source]" },
      ],
      nextFunctions: [],
    },
    {
      moduleRepo: "#add",
      key: 7,
      inputsSource: [
        { source: 8, target: "numbersToAdd[$source]", sourceOutput:"result" },
        { source: 8, target: "numbersToAdd[$source]", sourceOutput:"result" },
      ],
      nextFunctions: [],
    },
    {
      moduleRepo: "#subtract",
      key: 8,
      inputsSource: [
        { source: "!numericEight", target: "A" },
        { source: "!numericThree", target: "B" },
      ],
      nextFunctions: [],
    },
    {
      moduleRepo: "#add",
      key: 9,
      inputsSource: [
        { source: 5, target: "numbersToAdd[$source]", sourceOutput:"result" },
        { source: "!numericEight", target: "numbersToAdd[$source]" },
      ],
      nextFunctions: [
        { nextKey: 10, branch: "result" },
      ],
    },
    {
      moduleRepo: "#add",
      key: 10,
      inputsSource: [
        { source: 9, target: "numbersToAdd[$source]", sourceOutput:"result" },
        { source: 2, target: "numbersToAdd[$source]", sourceOutput:"result" },
      ],
      nextFunctions: [],
    },
  ],
  usedAsRoute: true,
  customObjects: [],
};
