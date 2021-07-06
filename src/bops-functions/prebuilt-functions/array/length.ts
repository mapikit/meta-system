import { InternalMetaFunction } from "../../internal-meta-function";

export const arrayLengthBopsFunction = (input : { array : unknown[] }) : unknown => {
  return ({ result: input.array.length });
};

export const arrayLengthBopsFunctionInformation : InternalMetaFunction = {
  functionName: "arrayLengthBopsFunction",
  version: "1.0.0",
  description: "Gets the length of the list",
  inputParameters: {
    array: { type: "array", subtype: "any", required: true },
  },
  outputData: {
    result: { type: "number", required: true },
  },
};
