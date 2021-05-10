import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const andGateBopsFunction = (input : { A : boolean; B : boolean }) : unknown => {
  const andTrue = input.A && input.B;

  const andFalse = !andTrue;

  if (andTrue) return ({ andTrue });

  return ({ andFalse });
};

export const andGateBopsFunctionInformation : InternalMetaFunction = {
  functionName: "andGateBopsFunction",
  version: "1.0.0",
  description: "And gate comparing boolean values for A and B",
  outputData: [
    {
      type: "boolean",
      name: "andTrue",
      branch: "andTrue",
    },
    {
      type: "boolean",
      name: "andFalse",
      branch: "andFalse",
    },
  ],
  outputBranches: [
    {
      branchName: "andTrue",
    },
    {
      branchName: "andFalse",
    },
  ],
  inputParameters: [
    { name: "A", type: "boolean", required: true },
    { name: "B", type: "boolean", required: true },
  ],
  customTypes: [],
};
