import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const orGateBopsFunction = (input : { A : boolean; B : boolean }) : unknown => {
  const orTrue = input.A || input.B;

  const orFalse = !orTrue;

  if (orTrue) return ({ orTrue });

  return ({ orFalse });
};

export const orGateBopsFunctionInformation : InternalMetaFunction = {
  functionName: "orGateBopsFunction",
  version: "1.0.0",
  description: "OR gate comparing boolean values for A and B",
  outputData: [
    {
      type: "boolean",
      name: "orTrue",
      branch: "orTrue",
    },
    {
      type: "boolean",
      name: "orFalse",
      branch: "orFalse",
    },
  ],
  outputBranches: [
    {
      branchName: "orTrue",
    },
    {
      branchName: "orFalse",
    },
  ],
  inputParameters: [
    { name: "A", type: "boolean", required: true },
    { name: "B", type: "boolean", required: true },
  ],
  customTypes: [],
};
