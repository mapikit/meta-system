import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const lowerOrEqualToBopsFunction = (input : { A : number; B : number }) : unknown => {
  const isLowerOrEqual = input.A <= input.B;
  const isNotLowerOrEqual = !isLowerOrEqual;

  if (isLowerOrEqual) return ({ isLowerOrEqual });

  return ({ isNotLowerOrEqual });
};

export const lowerOrEqualToBopsFunctionInformation : InternalMetaFunction = {
  functionName: "lowerOrEqualToBopsFunction",
  version: "1.0.0",
  description: "compares A to B, returning if A is lower or equal to B",
  outputData: [
    {
      type: "boolean",
      name: "isLowerOrEqual",
      branch: "isLowerOrEqual",
    },
    {
      type: "boolean",
      name: "isNotLowerOrEqual",
      branch: "isNotLowerOrEqual",
    },
  ],
  outputBranches: [
    {
      branchName: "isLowerOrEqual",
    },
    {
      branchName: "isNotLowerOrEqual",
    },
  ],
  inputParameters: [
    { name: "A", type: "number", required: true },
    { name: "B", type: "number", required: true },
  ],
  customTypes: [],
};
