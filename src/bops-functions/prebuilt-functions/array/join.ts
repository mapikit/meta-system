import { InternalMetaFunction } from "../../internal-meta-function.js";

export const arrayJoinBopsFunction = (input : { array : unknown[]; separator ?: string }) : unknown => {
  return ({ result: input.array.join(input.separator ?? ",") });
};

export const arrayJoinBopsFunctionInformation : InternalMetaFunction = {
  functionName: "arrayJoin",
  description: "Joins Items of an array",
  input: {
    array: { type: "array", subtype: "any", required: true },
    separator: { type: "string", required: false },
  },
  output: {
    result: { type: "array", subtype: "any", required: true },
  },
};
