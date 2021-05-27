import { BusinessOperations } from "@api/configuration-de-serializer/domain/business-operations-type";

export const mixedFunctionsBop : BusinessOperations = {
  name: "mixed-functions",
  inputs: [],
  outputs: [],
  route: "/cars/:carId/sell",
  constants: [
    { name: "randomModel", type: "string", value: "Vectra" },
    { name: "numericNine", type: "number", value: 9 },
    { name: "modelToUpdate", type: "string", value: "Onix" },
  ],
  configuration: [
    {
      moduleRepo: "@car@create",
      key: 2,
      inputsSource: [
        { source: "!randomModel", target: "entity.model" },
        { source: 1, sourceOutput: "result", target: "entity.year" },
      ],
      nextFunctions: [
        { nextKey: 3, branch: "default" },
      ],
    },
    {
      moduleRepo: "#sqrt",
      key: 1,
      inputsSource: [
        { source: "!numericNine", target: "A" },
      ],
      nextFunctions: [
        { nextKey: 2, branch: "result" },
      ],
    },
    {
      moduleRepo: "@car@updateById",
      key: 3,
      inputsSource: [
        { source: 2, sourceOutput: "createdEntity._id", target: "id" },
        { source: "!modelToUpdate", target: "valuesToUpdate.model" },
        { source: 1, sourceOutput: "result", target: "valuesToUpdate.year" },
      ],
      nextFunctions: [
        { nextKey: 5, branch: "default" },
      ],
    },
    {
      moduleRepo: "%bops-function-hello-world",
      key: 4,
      inputsSource: [
        { source: 5, sourceOutput: "entity.model", target: "nameToGreet" },
      ],
      nextFunctions: [],
    },
    {
      moduleRepo: "@car@getById",
      key: 5,
      inputsSource: [
        { source: 3, sourceOutput: "updatedEntity._id", target: "id" },
      ],
      nextFunctions: [
        { nextKey: 4, branch: "default" },
      ],
    },
  ],
  usedAsRoute: true,
  customObjects: [],
};
