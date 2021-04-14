import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const joinBopsFunction = (input : { array : unknown[]; separator ?: string }) : unknown => {
  return ({ result: input.array.join(input.separator ?? ",") });
};

export const joinBopsFunctionInformation : InternalMetaFunction = {
  functionName: "joinBopsFunction",
  version: "1.0.0",
  description: "Joins Items of an array",
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
    { name: "array", type: "array.any", required: true },
    { name: "separator", type: "string" },
  ],
  customTypes: [],
};
