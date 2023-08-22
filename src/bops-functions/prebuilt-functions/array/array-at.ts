import { InternalMetaFunction } from "../../internal-meta-function.js";

export const arrayAtBopsFunction = (input : { array : unknown[]; index : number }) : unknown => {
  const found = input.array[input.index];

  if (found === undefined) {
    return ({ notFoundMessage: "There is no item present at the given index" });
  }

  return ({ found });
};

export const arrayAtBopsFunctionInformation : InternalMetaFunction = {
  functionName: "arrayAt",
  description: "Gets the item in the array at the index given",
  input: {
    array: { type: "array", subtype: "any", required: true },
    index: { type: "number", required: true },
  },
  output: {
    found: { type: "any", required: false },
    notFoundMessage: { type: "string", required: false },
  },
};
