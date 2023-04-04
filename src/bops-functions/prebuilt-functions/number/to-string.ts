import { InternalMetaFunction } from "../../internal-meta-function.js";

export const numberToStringFunction = (input : { number : number }) : unknown => {
  if (Number.isNaN(input.number)) {
    return ({ errorMessage: "Cannot convert NaN" });
  }

  return ({ result: input.number.toString() });
};

export const numberToStringFunctionInformation : InternalMetaFunction = {
  functionName: "numberToString",
  version: "1.0.0",
  description: "Gets the index of a substring in the string",
  output: {
    result: { type: "number", required: false },
    errorMessage: { type: "string", required: false },
  },
  input: {
    number: { type: "number", required: true },
  },
};
