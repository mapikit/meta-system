import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const notBopsFunction = (input : { A : boolean }) : unknown => {
  return ({ result: !input.A });
};

export const notBopsFunctionInformation : InternalMetaFunction = {
  functionName: "notBopsFunction",
  version: "1.0.0",
  description: "Inverts the boolean value of A",
  outputData: [
    {
      type: "boolean",
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
    { name: "A", type: "boolean", required: true },
  ],
  customTypes: [],
};
