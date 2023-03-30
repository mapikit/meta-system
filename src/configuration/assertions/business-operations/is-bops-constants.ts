import { ExtendedJsonTypes } from "../../../common/types/json-types";
import { BopsConstant } from "../../business-operations/business-operations-type.js";
import { isType } from "../is-type";
import { stringIsOneOf } from "../string-is-one-of";


export function isBopsConstants (input : unknown) : asserts input is BopsConstant[] {
  if (!Array.isArray(input)) {
    throw Error("Business Operation Input with wrong type found: constants should be an Array");
  }

  const constants = input as BopsConstant[];

  const extendedJsonTypesArray : ExtendedJsonTypes[] = [
    "string", "date", "number", "boolean", "object", "array", "any",
  ];

  constants.forEach((constant) => {
    isType("string", "Constant name should be string", constant.name);
    if (constant.type !== undefined) stringIsOneOf(constant.type, extendedJsonTypesArray);
    else constant.type = getAutoValueType(constant.value, extendedJsonTypesArray);
  });
}

function getAutoValueType (value : unknown, availableTypes : ExtendedJsonTypes[]) : ExtendedJsonTypes {
  if(Array.isArray(value)) return "array";
  if(value instanceof Date) return "date";
  const autoType = typeof value;
  return availableTypes.includes(autoType as ExtendedJsonTypes) ? autoType as ExtendedJsonTypes : "any";
}
