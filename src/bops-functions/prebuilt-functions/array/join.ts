import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const arrayJoinBopsFunction = (input : { array : unknown[]; separator ?: string }) : unknown => {
  return ({ result: input.array.join(input.separator ?? ",") });
};

export const arrayJoinBopsFunctionInformation : InternalMetaFunction = {
  functionName: "arrayJoinBopsFunction",
  version: "1.0.0",
  description: "Joins Items of an array",
  outputData: [
    {
      type: "array.any",
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
