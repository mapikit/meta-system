import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";
import { CloudedObject } from "@api/common/types/clouded-object";

export const objectToStringBopsFunction = (input : { object : CloudedObject }) : unknown => {
  return ({ result: JSON.stringify(input.object) });
};

export const objectToStringBopsFunctionInformation : InternalMetaFunction = {
  functionName: "objectToStringBopsFunction",
  version: "1.0.0",
  description: "Transforms an object into a JSON-like string",
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
    { name: "object", type: "cloudedObject", required: true },
  ],
  customTypes: [],
};
