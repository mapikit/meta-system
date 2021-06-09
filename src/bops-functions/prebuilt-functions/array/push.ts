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
  inputParameters: {
    targetArray: { type: "array", subtype: "any", required: true },
    newItems: { type: "array", subtype: "any", required: false },
    item: { type: "any", required: false },
  },
  outputData: {
    result: { type: "array", subtype: "any", required: true },
  },
};
