import { InternalMetaFunction } from "../../internal-meta-function.js";

export const stringToNumberBopsFunction = (input : { string : string }) : unknown => {
  const result = Number(input.string);

  if (Number.isNaN(result)) {
    return ({ errorMessage: "Given string is not convertible to a number" });
  }

  return ({ result });
};

export const stringToNumberBopsFunctionInformation : InternalMetaFunction = {
  functionName: "stringToNumber",
  description: "Converts a given string to a Number",
  input: {
    string: { type: "string", required: true },
  },
  output: {
    result: { type: "number", required: false },
    errorMessage: { type: "string", required: false },
  },
};
