import { InternalMetaFunction } from "../../internal-meta-function.js";

export const stringConcatFunction = (input : { strings : Record<string, string> })
: unknown => {
  let result = "";
  Object.values(input.strings).forEach(value => {
    result += value.toString();
  });
  return ({ result });
};

export const stringConcatFunctionInformation : InternalMetaFunction = {
  functionName: "stringConcat",
  description: "Concatenates all given strings in order",
  input: {
    strings: { type: "object", required: true, subtype: "string" },
  },
  output: {
    result: { type: "string", required: true },
  },
};
