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
  inputParameters: {
    array: { type: "array", subtype: "any", required: true },
    index: { type: "number", required: true },
  },
  outputData: {
    resultingArray: { type: "array", subtype: "any", required: false },
    removedItem: { type: "any", required: false },
    notFoundMessage: { type: "string", required: false },
  },
};
