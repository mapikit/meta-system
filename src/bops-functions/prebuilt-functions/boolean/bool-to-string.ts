import { InternalMetaFunction } from "../../internal-meta-function.js";

export const boolToStringBopsFunction = (input : { boolean : boolean }) : unknown => {
  return ({ result: input.boolean.toString() });
};

export const boolToStringBopsFunctionInformation : InternalMetaFunction = {
  functionName: "boolToString",
  description: "Converts a boolean to its string representation",
  input: {
    boolean: { type: "boolean", required: true },
  },
  output: {
    result: { type: "string", required: true },
  },
};
