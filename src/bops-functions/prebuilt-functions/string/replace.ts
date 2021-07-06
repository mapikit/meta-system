import { InternalMetaFunction } from "src/bops-functions/internal-meta-function";

export const stringReplaceFunction = (input : { baseString : string; search : string; replacer : string })
: unknown => {
  return ({ result: input.baseString.replace(input.search, input.replacer) });
};

export const stringReplaceFunctionInformation : InternalMetaFunction = {
  functionName: "stringReplaceFunction",
  version: "1.0.0",
  description: "Replaces a part of a string",
  inputParameters: {
    baseString: { type: "string", required: true },
    search: { type: "string", required: true },
    replacer: { type: "string", required: true },
  },
  outputData: {
    result: { type: "string", required: true },
  },
};
