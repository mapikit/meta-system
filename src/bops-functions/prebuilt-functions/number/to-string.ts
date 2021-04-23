import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const numberToStringFunction = (input : { number : number }) : unknown => {
  return ({ result: input.number.toString() });
};

export const numberToStringFunctionInformation : InternalMetaFunction = {
  functionName: "numberToStringFunction",
  version: "1.0.0",
  description: "Gets the index of a substring in the string",
  outputData: [
    {
      type: "number",
      name: "result",
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
  ],
  customTypes: [],
};
