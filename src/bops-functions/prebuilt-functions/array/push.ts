import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const arrayPushBopsFunction = (input : {
  targetArray ?: unknown[];
  newItems ?: unknown[];
  item ?: unknown;
}) : unknown => {
  const resultArray = [...(input.targetArray ?? [])];

  if (input.item !== undefined) {
    resultArray.push(input.item);
  }

  return ({ result: [...resultArray, ...input.newItems ?? [] ] });
};

export const arrayPushBopsFunctionInformation : InternalMetaFunction = {
  functionName: "arrayPushBopsFunction",
  version: "1.0.0",
  description: "Pushes items into the array",
  outputData: [
    {
      type: "array.any",
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
    { name: "targetArray", type: "array.any", required: false },
    { name: "newItems", type: "array.any", required: false },
    { name: "item", type: "any", required: false },
  ],
  customTypes: [],
};
