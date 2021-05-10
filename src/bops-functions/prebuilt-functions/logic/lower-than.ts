import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const lowerThanBopsFunction = (input : { A : number; B : number }) : unknown => {
  const isLower = input.A < input.B;
  const isNotLower = !isLower;

  if (isLower) return ({ isLower });

  return ({ isNotLower });
};

export const lowerThanBopsFunctionInformation : InternalMetaFunction = {
  functionName: "lowerThanBopsFunction",
  version: "1.0.0",
  description: "compares A to B, returning if A is lower than B",
  outputData: [
    {
      type: "boolean",
      name: "isLower",
      branch: "isLower",
    },
    {
      type: "boolean",
      name: "isNotLower",
      branch: "isNotLower",
    },
  ],
  outputBranches: [
    {
      branchName: "isLower",
    },
    {
      branchName: "isNotLower",
    },
  ],
  inputParameters: [
    { name: "A", type: "number", required: true },
    { name: "B", type: "number", required: true },
  ],
  customTypes: [],
};
