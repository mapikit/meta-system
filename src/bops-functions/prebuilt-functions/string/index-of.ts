import { InternalMetaFunction } from "src/bops-functions/internal-meta-function";

export const indexOfStringFunction = (input : { string : string; search : string }) : unknown => {
  return ({ index: input.string.indexOf(input.search) });
};

export const indexOfStringFunctionInformation : InternalMetaFunction = {
  functionName: "indexOfStringFunction",
  version: "1.0.0",
  description: "Gets the index of a substring in the string",
  inputParameters: {
    string: { type: "string", required: true },
    search: { type: "string", required: true },
  },
  outputData: {
    index: { type: "number", required: true },
  },
};
