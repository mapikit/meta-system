import { BusinessOperations } from "@api/configuration-de-serializer/domain/business-operations-type";
import { isType } from "@api/configuration-de-serializer/domain/assertions/is-type";
import { isBopsInput } from "./is-bops-input";
import { isBopsOutput } from "./is-bops-output";
import { isBopsConstants } from "./is-bops-constants";
import { isBopsCustomObjects } from "./is-bops-custom-objects";
import { isBopsConfigurationEntry } from "./is-bops-configuration";

const requiredObjectKeys : Array<keyof BusinessOperations> = [
  "configuration",
  "constants",
  "customObjects",
  "inputs",
  "name",
  "outputs",
  "route",
  "usedAsRoute",
];

// eslint-disable-next-line max-lines-per-function
export function isBusinessOperations (input : unknown) : asserts input is BusinessOperations {
  if (typeof input !== "object") {
    throw new Error("Business Operation with incorrect format found: Not an object");
  }

  const inputKeys = Object.keys(input);

  requiredObjectKeys.forEach((requiredKey) => {
    if (!inputKeys.includes(requiredKey)) {
      throw new Error(`Business Operation with incorrect format found: Missing key "${requiredKey}"`);
    }
  });

  const businessOperationInput = input as BusinessOperations;

  isType("string", "Business Operation with incorrect format", businessOperationInput.name);
  isType("boolean", "Business Operation with incorrect format", businessOperationInput.usedAsRoute);

  if (businessOperationInput.usedAsRoute) {
    isType("string", "Business Operation with incorrect format", businessOperationInput.route);
  }

  isBopsInput(businessOperationInput.inputs);
  isBopsOutput(businessOperationInput.outputs);
  isBopsConstants(businessOperationInput.constants);
  isBopsCustomObjects(businessOperationInput.customObjects);
  isBopsConfigurationEntry(businessOperationInput.configuration);
};
