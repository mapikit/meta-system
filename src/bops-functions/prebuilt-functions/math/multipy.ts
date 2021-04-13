import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";
import { getGreatestDecimalPlaces }
  from "@api/bops-functions/prebuilt-functions/non-bops-utils/get-largest-decimal-places";
import { anyIsNan } from "@api/bops-functions/prebuilt-functions/non-bops-utils/any-is-nan";

export const multiplyBopsFunction = (input : { numbersToMultiply : number[] }) : unknown => {
  if (anyIsNan(...input.numbersToMultiply)) {
    return ({ errorMessage: "One of the arguments provided was not a number" });
  }

  let result = 1;
  const decimalPlaces = Math.pow(10, getGreatestDecimalPlaces(...input.numbersToMultiply));
  const fixedNumbersToMultiply = input.numbersToMultiply.map((value) => value * decimalPlaces);

  fixedNumbersToMultiply.forEach((number) => {
    result *= number;
  });

  for (let i = 0; i <= fixedNumbersToMultiply.length -1; i ++) {
    result /= decimalPlaces;
  }

  return ({ result });
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
