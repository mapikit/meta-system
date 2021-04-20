import { BusinessOperations } from "@api/configuration-de-serializer/domain/business-operations-type";

export const bopception : BusinessOperations = {
  name: "bopception",
  inputs: [],
  outputs: [],
  route: "/cars/:carId/sell",
  constants: [
    { name: "incorrectType", type: "string", value: "configurationShouldBeAnArrayOfObjects" },
  ],
  configuration: [
    {
      moduleRepo: "*bops-engine",
      key: 1,
      inputsSource: [
        { source: "!incorrectType", target: "bopConfig.configuration" },
      ],
      nextFunctions: [],
    },
  ],
  usedAsRoute: true,
  customObjects: [],
};
