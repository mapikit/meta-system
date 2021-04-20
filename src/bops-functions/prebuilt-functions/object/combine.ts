import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";
import { CloudedObject } from "@api/common/types/clouded-object";

export const combineObjectBopsFunction = (input : { object1 : CloudedObject; object2 : CloudedObject }) : unknown => {
  const resultObject = {};

  Object.assign(resultObject, input.object1);
  Object.assign(resultObject, input.object2);

  return ({ combined: resultObject });
};

export const combineObjectBopsFunctionInformation : InternalMetaFunction = {
  functionName: "combineObjectBopsFunction",
  version: "1.0.0",
  description: "Creates an object with the given key and value",
  outputData: [
    {
      type: "cloudedObject",
      name: "combined",
      branch: "combined",
    },
  ],
  outputBranches: [
    {
      branchName: "combined",
    },
  ],
  inputParameters: [
    { name: "key", type: "string", required: false },
    { name: "value", type: "any", required: false },
  ],
  customTypes: [],
};
