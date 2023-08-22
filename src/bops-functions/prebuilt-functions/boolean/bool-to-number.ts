import { InternalMetaFunction } from "../../internal-meta-function.js";

export const boolToNumberBopsFunction = (input : { boolean : boolean }) : unknown => {
  return ({ result: input.boolean ? 1 : 0 });
};

export const boolToNumberBopsFunctionInformation : InternalMetaFunction = {
  functionName: "boolToNumber",
  description: "Converts a boolean to its numerical representation",
  input: {
    boolean: { type: "boolean", required: true },
  },
  output: {
    result: { type: "number", required: true },
  },
};
