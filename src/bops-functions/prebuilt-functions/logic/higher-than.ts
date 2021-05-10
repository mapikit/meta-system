import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const higherThanBopsFunction = (input : { A : number; B : number }) : unknown => {
  const isHigher = input.A > input.B;
  const isNotHigher = !isHigher;

  if (isHigher) return ({ isHigher });

  return ({ isNotHigher });
};

export const higherThanBopsFunctionInformation : InternalMetaFunction = {
  functionName: "higherThanBopsFunction",
  version: "1.0.0",
  description: "compares A to B, returning if A is higher than B",
  outputData: [
    {
      type: "boolean",
      name: "isHigher",
      branch: "isHigher",
    },
    {
      type: "boolean",
      name: "isNotHigher",
      branch: "isNotHigher",
    },
  ],
  outputBranches: [
    {
      branchName: "isHigher",
    },
    {
      branchName: "isNotHigher",
    },
  ],
  inputParameters: [
    { name: "A", type: "number", required: true },
    { name: "B", type: "number", required: true },
  ],
  customTypes: [],
};
