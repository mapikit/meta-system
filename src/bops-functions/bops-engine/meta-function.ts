import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const bopsEngineInfo : InternalMetaFunction = {
  functionName: "bops-engine",
  description: "Executes a flow of functions as defined in the BOp configuration",
  version: "0.0.1",
  inputParameters: [
    {
      type: "cloudedObject",
      name: "bopConfig",
      required: true,
    },
  ],
  outputBranches: [
    {
      branchName: "default",
      description: "The results of all executed functions",
    },
    {
      branchName: "errorBranch",
      description: "An error occourred during execution of flow",
    },
  ],
  outputData: [
    {
      name: "results",
      type: "cloudedObject",
      branch: "default",
    },
    {
      name: "executionError",
      type: "$error",
      branch: "errorBranch",
    },
  ],
  customTypes: [
    {
      name: "error",
      properties: [
        {
          name: "errorName",
          type: "string",
        },
        {
          name: "errorMessage",
          type: "string",
        },
      ],
    },
  ],
};
