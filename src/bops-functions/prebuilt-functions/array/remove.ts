import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const arrayRemoveBopsFunction = (input : { array : unknown[]; index : number }) : unknown => {
  const found = input.array[input.index];

  if (found === undefined) {
    return ({ notFoundMessage: "There is no item present at the given index" });
  }

  const arrayCopy = [...input.array];

  const removedItem = arrayCopy.splice(input.index, 1)[0];

  return ({ resultingArray: arrayCopy, removedItem });
};

export const arrayRemoveBopsFunctionInformation : InternalMetaFunction = {
  functionName: "arrayRemoveBopsFunction",
  version: "1.0.0",
  description: "Removes the item at the given index from the array",
  outputData: [
    {
      type: "array.any",
      name: "resultingArray",
      branch: "removed",
    },
    {
      type: "any",
      name: "removedItem",
      branch: "removed",
    },
    {
      type: "string",
      name: "notFoundMessage",
      branch: "notFound",
    },
  ],
  outputBranches: [
    {
      branchName: "removed",
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
