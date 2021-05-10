import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const boolToStringBopsFunction = (input : { boolean : boolean }) : unknown => {
  return ({ result: input.boolean.toString() });
};

export const boolToStringBopsFunctionInformation : InternalMetaFunction = {
  functionName: "boolToStringBopsFunction",
  version: "1.0.0",
  description: "Converts a boolean to its string representation",
  outputData: [
    {
      type: "string",
      name: "result",
      branch: "result",
    },
  ],
  outputBranches: [
    {
      branchName: "result",
    },
  ],
  inputParameters: [
    { name: "boolean", type: "boolean", required: true },
  ],
  customTypes: [],
};
