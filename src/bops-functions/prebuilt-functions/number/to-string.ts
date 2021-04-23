import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const numberToStringFunction = (input : { number : number }) : unknown => {
  if (Number.isNaN(input.number)) {
    return ({ errorMessage: "Cannot convert NaN" });
  }

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
    {
      type: "string",
      name: "errorMessage",
      branch: "errorNaN",
    },
  ],
  outputBranches: [
    {
      branchName: "default",
    },
    {
      branchName: "errorNaN",
    },
  ],
  inputParameters: [
    { name: "string", type: "string", required: true },
  ],
  customTypes: [],
};
