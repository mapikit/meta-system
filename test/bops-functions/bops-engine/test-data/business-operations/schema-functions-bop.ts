import { BusinessOperations } from "@api/configuration/domain/business-operations-type";

export const schemaFunctionsBop : BusinessOperations = {
  name: "schema-functions",
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
    { name: "randomModelOne", type: "string", value: "Onix" },
    { name: "randomModelTwo", type: "string", value: "Vectra" },
    { name: "randomYearOne", type: "number", value: 1500 },
    { name: "randomYearTwo", type: "number", value: 1900 },
  ],
  configuration: [
    {
      moduleRepo: "@car@create",
      key: 1,
      inputsSource: [
        { source: "!randomModelOne", target: "entity.model" },
        { source: "!randomYearOne", target: "entity.year" },
      ],
      nextFunctions: [
        { nextKey: 2, branch: "default" },
      ],
    },
    {
      moduleRepo: "@car@create",
      key: 2,
      inputsSource: [
        { source: "!randomModelTwo", target: "entity.model" },
        { source: "!randomYearTwo", target: "entity.year" },
      ],
      nextFunctions: [
        { nextKey: 3, branch: "default" },
      ],
    },
    {
      moduleRepo: "@car@getById",
      key: 3,
      inputsSource: [
        { source: 2, sourceOutput: "createdEntity._id", target: "id" },
      ],
      nextFunctions: [
        { nextKey: 4, branch: "default" },
      ],
    },
    {
      moduleRepo: "@car@updateById",
      key: 4,
      inputsSource: [
        { source: 2, sourceOutput: "createdEntity._id", target: "id" },
        { source: 1, sourceOutput: "createdEntity.model", target: "valuesToUpdate.model" },
      ],
      nextFunctions: [
        { nextKey: 5, branch: "default" },
      ],
    },
    {
      moduleRepo: "@car@deleteById",
      key: 5,
      inputsSource: [
        { source: 1, sourceOutput: "createdEntity._id", target: "id" },
      ],
      nextFunctions: [
        { nextKey: 6, branch: "default" },
      ],
    },
    {
      moduleRepo: "@car@get",
      key: 6,
      inputsSource: [
        { source: 3, sourceOutput: "entity.model", target: "query.model.equal_to" },
      ],
      nextFunctions: [
        { nextKey: 7, branch: "default" },
      ],
    },
    {
      moduleRepo: "@car@get",
      key: 7,
      inputsSource: [
        { source: 1, sourceOutput: "createdEntity.model", target: "query.model.equal_to" },
      ],
      nextFunctions: [],
    },
  ],
  usedAsRoute: true,
  customObjects: [],
};
