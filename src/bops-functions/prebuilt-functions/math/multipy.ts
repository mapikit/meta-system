import { InternalMetaFunction } from "../../internal-meta-function.js";
import { anyIsNan } from "../non-bops-utils/any-is-nan.js";
import { Decimal } from "decimal.js";

export const multiplyBopsFunction = (input : { numbersToMultiply : number[] }) : unknown => {
  if (anyIsNan(...input.numbersToMultiply)) {
    return ({ errorMessage: "One of the arguments provided was not a number" });
  }

  let result = new Decimal(1);
  const decimalNumbersToMultiply = input.numbersToMultiply.map((value) => new Decimal(value));

  decimalNumbersToMultiply.forEach((number) => {
    result = result.mul(number);
  });

  return ({ result: result.toNumber() });
};

export const multiplyFunctionInformation : InternalMetaFunction = {
  functionName: "multiply",
  description: "Multiply the list of numbers provided",
  input: {
    numbersToMultiply: { type: "array", subtype: "number",  required: true },
  },
  output: {
    result: { type: "number",  required: false },
    errorMessage: { type: "string",  required: false },
  },
};
