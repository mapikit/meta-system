import { BopsVariable } from "../../business-operations/business-operations-type.js";
import { isType } from "../is-type";
import { stringIsOneOf } from "../string-is-one-of";


export function isBopsVariables (input : unknown) : asserts input is BopsVariable[] {
  if (!Array.isArray(input)) {
    throw Error("Business Operation Input with wrong type found: variables should be an Array");
  }

  const variables = input as BopsVariable[];

  const extendedJsonTypesArray = [
    "string", "date", "number", "boolean", "object", "array", "any",
  ];

  variables.forEach((variable) => {
    isType("string", "Variable name should be string", variable.name);
    stringIsOneOf(variable.type, extendedJsonTypesArray);
  });
}
