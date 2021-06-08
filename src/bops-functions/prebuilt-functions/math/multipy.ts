import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";
import { anyIsNan } from "@api/bops-functions/prebuilt-functions/non-bops-utils/any-is-nan";
import Decimal from "decimal.js";

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
  functionName: "multiplyBopsFunction",
  version: "1.0.0",
  description: "Multiply the list of numbers provided",
  inputParameters: {
    numbersToMultiply: { type: "array.number",  required: true },
  },
  outputData: {
    result: { type: "number",  required: false },
    errorMessage: { type: "string",  required: false },
  },
};
