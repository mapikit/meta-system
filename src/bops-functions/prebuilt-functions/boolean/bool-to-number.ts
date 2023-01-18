import { InternalMetaFunction } from "../../internal-meta-function";

export const boolToNumberBopsFunction = (input : { boolean : boolean }) : unknown => {
  return ({ result: input.boolean ? 1 : 0 });
};

export const boolToNumberBopsFunctionInformation : InternalMetaFunction = {
  functionName: "boolToNumber",
  version: "1.0.0",
  description: "Converts a boolean to its numerical representation",
  input: {
    boolean: { type: "boolean", required: true },
  },
  output: {
    result: { type: "number", required: true },
  },
};
