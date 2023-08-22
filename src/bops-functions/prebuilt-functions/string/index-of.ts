import { InternalMetaFunction } from "../../internal-meta-function.js";

export const indexOfStringFunction = (input : { string : string; search : string }) : unknown => {
  return ({ index: input.string.indexOf(input.search) });
};

export const indexOfStringFunctionInformation : InternalMetaFunction = {
  functionName: "indexOfString",
  description: "Gets the index of a substring in the string",
  input: {
    string: { type: "string", required: true },
    search: { type: "string", required: true },
  },
  output: {
    index: { type: "number", required: true },
  },
};
