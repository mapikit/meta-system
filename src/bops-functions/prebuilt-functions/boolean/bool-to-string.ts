import { InternalMetaFunction } from "../../internal-meta-function";

export const boolToStringBopsFunction = (input : { boolean : boolean }) : unknown => {
  return ({ result: input.boolean.toString() });
};

export const boolToStringBopsFunctionInformation : InternalMetaFunction = {
  functionName: "boolToStringBopsFunction",
  version: "1.0.0",
  description: "Converts a boolean to its string representation",
  inputParameters: {
    boolean: { type: "boolean", required: true },
  },
  outputData: {
    result: { type: "string", required: true },
  },
};
