import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";
import Decimal from "decimal.js";
import { anyIsNan } from "@api/bops-functions/prebuilt-functions/non-bops-utils/any-is-nan";

export const addBopsFunction = (input : { numbersToAdd : number[] }) : unknown => {
  if (anyIsNan(...input.numbersToAdd)) {
    return ({ errorMessage: "One of the arguments provided was not a number" });
  }

  const convertedNumbersToAdd = input.numbersToAdd.map((value) => new Decimal(value));

  let result = new Decimal(0);
  convertedNumbersToAdd.forEach((number) => {
    result = result.plus(number);
  });

  return ({ result: result.toNumber() });
};

export const addFunctionInformation : InternalMetaFunction = {
  functionName: "addBopsFunction",
  version: "1.0.0",
  description: "Adds numbers together",
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
    { name: "numbersToAdd", type: "array.number" },
  ],
  customTypes: [],
};
