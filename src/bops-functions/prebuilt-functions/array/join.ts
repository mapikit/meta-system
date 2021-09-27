import { InternalMetaFunction } from "../../internal-meta-function";

export const arrayJoinBopsFunction = (input : { array : unknown[]; separator ?: string }) : unknown => {
  return ({ result: input.array.join(input.separator ?? ",") });
};

export const arrayJoinBopsFunctionInformation : InternalMetaFunction = {
  functionName: "arrayJoin",
  version: "1.0.0",
  description: "Joins Items of an array",
  inputParameters: {
    array: { type: "array", subtype: "any", required: true },
    separator: { type: "string", required: false },
  },
  outputData: {
    result: { type: "array", subtype: "any", required: true },
  },
};
