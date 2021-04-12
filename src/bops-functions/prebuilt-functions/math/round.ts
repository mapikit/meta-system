import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";
import { getDecimalPlaces } from "@api/bops-functions/prebuilt-functions/non-bops-utils/get-decimal-places";

export const roundBopsFunction = (input : { input : number; precision : number }) : unknown => {
  if (Math.sign(input.precision) === -1) {
    return ({ errorNegativePrecision: "Precision cannot be a negative value" });
  }

  const decimalPrecision = Math.pow(10, getDecimalPlaces(input.precision));
  const precision = input.precision * decimalPrecision;
  const toBeRoundedInput = input.input * decimalPrecision;

  const modulus = toBeRoundedInput%precision;
  const roundingDifference = Math.sign(modulus-precision) * modulus;

  const result = roundingDifference + toBeRoundedInput;

  if (Number.isNaN(Number(result))) {
    return ({ errorNaN: "One of the arguments provided was not a number" });
  }

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
    {
      type: "string",
      name: "errorNegativePrecision",
      branch: "negativePrecision",
    },
  ],
  outputBranches: [
    {
      branchName: "result",
    },
    {
      branchName: "notANumber",
    },
    {
      branchName: "negativePrecision",
    },
  ],
  inputParameters: [
    { name: "input", type: "number", required: true },
    { name: "precision", type: "number", required: true },
  ],
  customTypes: [],
};
