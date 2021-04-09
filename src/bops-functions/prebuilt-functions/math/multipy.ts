import { MetaFunction } from "meta-function-helper";

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

export const multiplyFunctionInformation : MetaFunction = {
  functionName: "multiplyBopsFunction",
  version: "1.0.0",
  author: "mapikit",
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
  entrypoint: "",
  mainFunction: "",
};
