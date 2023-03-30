import { InternalMetaFunction } from "../../internal-meta-function.js";
import { anyIsNan } from "../non-bops-utils/any-is-nan.js";
import { getGreatestDecimalPlaces } from "../non-bops-utils/get-largest-decimal-places.js";

export const roundBopsFunction = (input : { input : number; precision : number }) : unknown => {
  if (anyIsNan(input.input, input.precision)) {
    return ({ errorNaN: "One of the arguments provided was not a number" });
  }

  const decimalPrecision = Math.pow(10, getGreatestDecimalPlaces(input.precision, input.input));
  const precision = Math.abs(input.precision * decimalPrecision);
  const toBeRoundedInput = input.input * decimalPrecision;

  const modulus = Math.abs(toBeRoundedInput%precision);
  const roundingDifference = Number(modulus >= precision - modulus) * precision - modulus;

  const result = roundingDifference + toBeRoundedInput;

  return ({ result: result/decimalPrecision });
};

export const roundFunctionInformation : InternalMetaFunction = {
  functionName: "round",
  version: "1.0.0",
  description: "Rounds Input to a given precision",
  input: {
    input: { type: "number",  required: true  },
    precision: { type: "number",  required: true  },
  },
  output: {
    result: { type: "number",  required: false },
    errorNaN: { type: "string",  required: false },
  },
};
