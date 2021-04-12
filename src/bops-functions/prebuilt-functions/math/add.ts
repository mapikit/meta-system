import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const addBopsFunction = (input : { numbersToAdd : number[] }) : unknown => {
  let result = 0;
  input.numbersToAdd.forEach((number) => {
    result += number;
  });

  if (Number.isNaN(Number(result))) {
    return ({ errorMessage: "One of the arguments provided was not a number" });
  }

  return ({ result });
};

export const addFunctionInformation : InternalMetaFunction = {
  functionName: "addBopsFunction",
  version: "1.0.0",
  description: "Adds numbers together",
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
    { name: "numbersToAdd", type: "array.number" },
  ],
  customTypes: [],
};
