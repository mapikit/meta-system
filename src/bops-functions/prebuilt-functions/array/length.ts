import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const arrayLengthBopsFunction = (input : { array : unknown[] }) : unknown => {
  return ({ result: input.array.length });
};

export const arrayLengthBopsFunctionInformation : InternalMetaFunction = {
  functionName: "arrayLengthBopsFunction",
  version: "1.0.0",
  description: "Gets the length of the list",
  outputData: [
    {
      type: "number",
      name: "result",
      branch: "result",
    },
  ],
  outputBranches: [
    {
      branchName: "result",
    },
  ],
  inputParameters: [
    { name: "array", type: "array.any", required: true },
  ],
  customTypes: [],
};