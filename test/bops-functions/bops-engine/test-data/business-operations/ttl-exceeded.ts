import { BusinessOperations } from "@api/configuration/domain/business-operations-type";

export const timeoutBop : BusinessOperations = {
  name: "timeout",
  inputs: [],
  outputs: [],
  route: "/cars/:carId/sell",
  constants: [
    { name: "randomModelTwo", type: "string", value: "Vectra" },
    { name: "randomYearTwo", type: "number", value: 1900 },
  ],
  configuration: [
    {
      moduleRepo: "@car@create",
      key: 1,
      inputsSource: [
        { source: "!randomModelTwo", target: "entity.model" },
        { source: "!randomYearTwo", target: "entity.year" },
      ],
      nextFunctions: [
        { nextKey: 2, branch: "default" },
      ],
    },
    {
      moduleRepo: "@car@getById",
      key: 2,
      inputsSource: [
        { source: 1, sourceOutput: "createdEntity._id", target: "id" },
      ],
      nextFunctions: [
        { nextKey: 3, branch: "default" },
      ],
    },
    {
      moduleRepo: "@car@getById",
      key: 3,
      inputsSource: [
        { source: 1, sourceOutput: "createdEntity._id", target: "id" },
      ],
      nextFunctions: [
        { nextKey: 2, branch: "default" },
      ],
    },
  ],
  usedAsRoute: true,
  customObjects: [],
};
