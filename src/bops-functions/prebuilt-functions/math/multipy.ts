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
  outputData: [
    {
      type: "number",
      name: "result",
      branch: "result",
    },
    {
      type: "string",
      name: "errorMessage",
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
    { name: "numbersToMultiply", type: "array.number" },
  ],
  customTypes: [],
};
