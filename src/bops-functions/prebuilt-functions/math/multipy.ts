import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const multiplyBopsFunction = (input : { numbersToMultiply : number[] }) : unknown => {
  let result = 1;
  input.numbersToMultiply.forEach((number) => {
    result *= number;
  });

  if (Number.isNaN(Number(result))) {
    return ({ errorMessage: "One of the arguments provided was not a number" });
  }

  return ({ result });
};

export const multiplyFunctionInformation : InternalMetaFunction = {
  functionName: "multiplyBopsFunction",
  version: "1.0.0",
  description: "Multiply the list of numbers provided",
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
    { name: "numbersToMultiply", type: "array.number" },
  ],
  customTypes: [],
};
