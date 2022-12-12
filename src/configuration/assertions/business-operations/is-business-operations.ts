import { isBopsConstants } from "./is-bops-constants";
import { isBopsCustomObjects } from "./is-bops-custom-objects";
import { isBopsConfigurationEntry } from "./is-bops-configuration";
import { isObjectDefinition } from "@meta-system/meta-function-helper/dist/src/object-definition/is-object-definition";
import { BusinessOperations } from "../../business-operations/business-operations-type";
import { isType } from "../is-type";
import { isBopsVariables } from "./is-bops-variables";

const requiredObjectKeys : Array<keyof BusinessOperations> = [
  "configuration",
  "constants",
  "variables",
  "customObjects",
  "input",
  "name",
  "output",
];

// eslint-disable-next-line max-lines-per-function
export function isBusinessOperations (input : unknown) : asserts input is BusinessOperations {
  if (typeof input !== "object") {
    throw new Error("Business Operation with incorrect format found: Not an object");
  }

  const inputKeys = Object.keys(input);

  requiredObjectKeys.forEach((requiredKey) => {
    if (!inputKeys.includes(requiredKey)) {
      const name : string = input["name"] ?? "Unnamed";
      throw new Error(`${name} Business Operation with incorrect format found: Missing key "${requiredKey}"`);
    }
  });

  const businessOperationInput = input as BusinessOperations;

  isType("string", "Business Operation with incorrect format", businessOperationInput.name);

  isObjectDefinition(businessOperationInput.input);
  isObjectDefinition(businessOperationInput.output);
  isBopsConstants(businessOperationInput.constants);
  isBopsVariables(businessOperationInput.variables);
  isBopsCustomObjects(businessOperationInput.customObjects);
  isBopsConfigurationEntry(businessOperationInput.configuration, businessOperationInput.name);
};
