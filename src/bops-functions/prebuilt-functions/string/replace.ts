import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const stringReplaceFunction = (input : { baseString : string; search : string; replacer : string })
: unknown => {
  return ({ result: input.baseString.replace(input.search, input.replacer) });
};

export const stringReplaceFunctionInformation : InternalMetaFunction = {
  functionName: "stringReplaceFunction",
  version: "1.0.0",
  description: "Replaces a part of a string",
  outputData: [
    {
      type: "string",
      name: "result",
      branch: "result",
    },
  ],
  outputBranches: [
    {
      branchName: "result",
    },
  ],
  inputParameters: [
    { name: "baseString", type: "string", required: true },
    { name: "search", type: "string", required: true },
    { name: "replacer", type: "string", required: true },
  ],
  customTypes: [],
};
