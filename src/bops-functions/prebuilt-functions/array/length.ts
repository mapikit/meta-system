import { InternalMetaFunction } from "../../internal-meta-function.js";

export const arrayLengthBopsFunction = (input : { array : unknown[] }) : unknown => {
  return ({ result: input.array.length });
};

export const arrayLengthBopsFunctionInformation : InternalMetaFunction = {
  functionName: "arrayLength",
  description: "Gets the length of the list",
  input: {
    array: { type: "array", subtype: "any", required: true },
  },
  output: {
    result: { type: "number", required: true },
  },
};
