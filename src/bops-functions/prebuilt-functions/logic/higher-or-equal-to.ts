import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const higherOrEqualToBopsFunction = (input : { A : number; B : number }) : unknown => {
  const isHigherOrEqual = input.A >= input.B;
  const isNotHigherOrEqual = !isHigherOrEqual;

  if (isHigherOrEqual) return ({ isHigherOrEqual });

  return ({ isNotHigherOrEqual });
};

export const higherOrEqualToBopsFunctionInformation : InternalMetaFunction = {
  functionName: "higherOrEqualToBopsFunction",
  version: "1.0.0",
  description: "compares A to B, returning if A is higher or equal to B",
  outputData: [
    {
      type: "boolean",
      name: "isHigherOrEqual",
      branch: "isHigherOrEqual",
    },
    {
      type: "boolean",
      name: "isNotHigherOrEqual",
      branch: "isNotHigherOrEqual",
    },
  ],
  outputBranches: [
    {
      branchName: "isHigherOrEqual",
    },
    {
      branchName: "isNotHigherOrEqual",
    },
  ],
  inputParameters: [
    { name: "A", type: "number", required: true },
    { name: "B", type: "number", required: true },
  ],
  customTypes: [],
};
