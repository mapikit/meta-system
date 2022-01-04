import { InternalMetaFunction } from "../../internal-meta-function";

export const arrayLengthBopsFunction = (input : { array : unknown[] }) : unknown => {
  return ({ result: input.array.length });
};

export const arrayLengthBopsFunctionInformation : InternalMetaFunction = {
  functionName: "arrayLength",
  version: "1.0.0",
  description: "Gets the length of the list",
  input: {
    array: { type: "array", subtype: "any", required: true },
  },
  output: {
    result: { type: "number", required: true },
  },
};
