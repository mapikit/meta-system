import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const arrayAtBopsFunction = (input : { array : unknown[]; index : number }) : unknown => {
  const found = input.array[input.index];

  if (found === undefined) {
    return ({ notFoundMessage: "There is no item present at the given index" });
  }

  return ({ found });
};

export const arrayAtBopsFunctionInformation : InternalMetaFunction = {
  functionName: "arrayAtBopsFunction",
  version: "1.0.0",
  description: "Gets the item in the array at the index given",
  outputData: [
    {
      type: "any",
      name: "found",
      branch: "found",
    },
    {
      type: "string",
      name: "notFoundMessage",
      branch: "notFound",
    },
  ],
  outputBranches: [
    {
      branchName: "found",
    },
    {
      branchName: "notFound",
    },
  ],
  inputParameters: [
    { name: "array", type: "array.any", required: true },
    { name: "index", type: "number", required: true },
  ],
  customTypes: [],
};
