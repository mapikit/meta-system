import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const indexOfStringFunction = (input : { string : string; search : string }) : unknown => {
  return ({ index: input.string.indexOf(input.search) });
};

export const indexOfStringFunctionInformation : InternalMetaFunction = {
  functionName: "indexOfStringFunction",
  version: "1.0.0",
  description: "Gets the index of a substring in the string",
  outputData: [
    {
      type: "number",
      name: "index",
      branch: "default",
    },
  ],
  outputBranches: [
    {
      branchName: "default",
    },
  ],
  inputParameters: [
    { name: "string", type: "string", required: true },
    { name: "search", type: "string", required: true },
  ],
  customTypes: [],
};
