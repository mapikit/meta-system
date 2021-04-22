import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const charAtBopsFunction = (input : { string : string; index : number }) : unknown => {
  const found = input.string[input.index];

  if (found === undefined) {
    return ({ notFoundMessage: "There is no character present at the given index" });
  }

  return ({ found });
};

export const charAtBopsFunctionInformation : InternalMetaFunction = {
  functionName: "charAtBopsFunction",
  version: "1.0.0",
  description: "Gets the character in the string at the index given",
  outputData: [
    {
      type: "string",
      name: "found",
      branch: "found",
    },
    {
      type: "string",
      name: "notFoundMessage",
      branch: "notFound",
    },
  ],
  outputBranches: [
    {
      branchName: "found",
    },
    {
      branchName: "notFound",
    },
  ],
  inputParameters: [
    { name: "array", type: "string", required: true },
    { name: "index", type: "number", required: true },
  ],
  customTypes: [],
};
