import { InternalMetaFunction } from "../../internal-meta-function";
import Decimal from "decimal.js";
import { anyIsNan } from "../non-bops-utils/any-is-nan";

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
  functionName: "add",
  version: "1.0.0",
  description: "Adds numbers together",
  input: {
    numbersToAdd: { type: "array", subtype: "number", required: true },
  },
  output: {
    result: { type: "number", required: false },
    errorMessage: { type: "string", required: false },
  },
};
