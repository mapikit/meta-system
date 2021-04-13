import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";
import { getGreatestDecimalPlaces }
  from "@api/bops-functions/prebuilt-functions/non-bops-utils/get-largest-decimal-places";
import { anyIsNan } from "@api/bops-functions/prebuilt-functions/non-bops-utils/any-is-nan";

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

export const multiplyFunctionInformation : InternalMetaFunction = {
  functionName: "roundBopsFunction",
  version: "1.0.0",
  description: "Rounds Input to a given precision",
  outputData: [
    {
      type: "number",
      name: "result",
      branch: "result",
    },
    {
      type: "string",
      name: "errorNaN",
      branch: "notANumber",
    },
  ],
  outputBranches: [
    {
      branchName: "result",
    },
    {
      branchName: "notANumber",
    },
  ],
  inputParameters: [
    { name: "input", type: "number", required: true },
    { name: "precision", type: "number", required: true },
  ],
  customTypes: [],
};
