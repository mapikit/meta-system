import { BopsConstant } from "../../business-operations/business-operations-type";
import { isType } from "../is-type";
import { stringIsOneOf } from "../string-is-one-of";


export function isBopsConstants (input : unknown) : asserts input is BopsConstant[] {
  if (!Array.isArray(input)) {
    throw Error("Business Operation Input with wrong type found: constants should be an Array");
  }

  const constants = input as BopsConstant[];

  const extendedJsonTypesArray = [
    "string", "date", "number", "boolean", "object", "array", "any",
  ];

  constants.forEach((constant) => {
    isType("string", "Constant name should be string", constant.name);
    stringIsOneOf(constant.type, extendedJsonTypesArray);
  });
}
