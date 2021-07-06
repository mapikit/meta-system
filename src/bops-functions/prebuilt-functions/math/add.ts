import { InternalMetaFunction } from "src/bops-functions/internal-meta-function";
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
  inputParameters: {
    numbersToAdd: { type: "array", subtype: "number", required: true },
  },
  outputData: {
    result: { type: "number", required: false },
    errorMessage: { type: "string", required: false },
  },
};
