import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const boolToNumberBopsFunction = (input : { boolean : boolean }) : unknown => {
  return ({ result: input.boolean ? 1 : 0 });
};

export const boolToNumberBopsFunctionInformation : InternalMetaFunction = {
  functionName: "boolToNumberBopsFunction",
  version: "1.0.0",
  description: "Converts a boolean to its numerical representation",
  outputData: [
    {
      type: "number",
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
