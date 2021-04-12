import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const subtractBopsFunction = (input : { A : number; B : number }) : unknown => {
  const result = input.A - input.B;

  if (Number.isNaN(Number(result))) {
    return ({ errorMessage: "One of the arguments provided was not a number" });
  }

  return ({ result });
};

export const subtractFunctionInformation : InternalMetaFunction = {
  functionName: "subtractBopsFunction",
  version: "1.0.0",
  description: "Subtracts B from A",
  outputData: [
    {
      type: "number",
      name: "result",
      branch: "result",
    },
    {
      type: "string",
      name: "errorMessage",
      branch: "notANumber",
    },
  ],
  outputBranches: [
    {
      branchName: "result",
    },
    {
      branchName: "notANumber",
    },
  ],
  inputParameters: [
    { name: "A", type: "number" },
    { name: "B", type: "number" },
  ],
  customTypes: [],
};