import { InternalMetaFunction } from "../../internal-meta-function";

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
  version: "1.0.0",
  description: "Concatenates all given strings in order",
  inputParameters: {
    strings: { type: "object", required: true, subtype: "string" },
  },
  outputData: {
    result: { type: "string", required: true },
  },
};
