import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const divideBopsFunction = (input : { A : number; B : number }) : unknown => {
  if (input.B === 0) {
    return ({ errorDivideByZero: "Cannot divide by zero" });
  }

  const result = input.A / input.B;

  if (Number.isNaN(Number(result))) {
    return ({ errorNaN: "One of the arguments provided was not a number" });
  }

  return ({ result });
};

export const subtractFunctionInformation : InternalMetaFunction = {
  functionName: "divideBopsFunction",
  version: "1.0.0",
  description: "Divides A by B",
  outputData: [
    {
      type: "number",
      name: "result",
      branch: "result",
    },
    {
      type: "string",
      name: "errorNaN",
      branch: "notANumber",
    },
    {
      type: "string",
      name: "errorDivideByZero",
      branch: "bIsZero",
    },
  ],
  outputBranches: [
    {
      branchName: "result",
    },
    {
      branchName: "notANumber",
    },
    {
      branchName: "bIsZero",
    },
  ],
  inputParameters: [
    { name: "A", type: "number" },
    { name: "B", type: "number" },
  ],
  customTypes: [],
};
