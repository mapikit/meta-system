import { BopsConstant } from "@api/configuration-de-serializer/domain/business-operations";
import { isType } from "@api/configuration-de-serializer/domain/assertions/is-type";
import { stringIsOneOf } from "@api/configuration-de-serializer/domain/assertions/string-is-one-of";

export function isBopsConstants (input : unknown) : asserts input is BopsConstant[] {
  if (!Array.isArray(input)) {
    throw Error("Business Operation Input with wrong type found: constants should be an Array");
  }

  const constants = input as BopsConstant[];

  const jsonTypesArray = [
    "string", "date", "number", "boolean",
  ];

  constants.forEach((constant) => {
    isType("string", "Constant name should be string", constant.name);
    stringIsOneOf(constant.type, jsonTypesArray);
  });
}
