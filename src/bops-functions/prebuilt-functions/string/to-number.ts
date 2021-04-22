import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const stringToNumberBopsFunction = (input : { string : string }) : unknown => {
  const result = Number(input.string);

  if (Number.isNaN(result)) {
    return ({ errorMessage: "Given string is not convertible to a number" });
  }

  return ({ result });
};

export const stringToNumberBopsFunctionInformation : InternalMetaFunction = {
  functionName: "stringToNumberBopsFunction",
  version: "1.0.0",
  description: "Converts a given string to a Number",
  outputData: [
    {
      type: "number",
      name: "result",
      branch: "result",
    },
    {
      type: "string",
      name: "errorMessage",
      branch: "couldNotCovert",
    },
  ],
  outputBranches: [
    {
      branchName: "result",
    },
    {
      branchName: "couldNotCovert",
    },
  ],
  inputParameters: [
    { name: "string", type: "string", required: true },
  ],
  customTypes: [],
};
