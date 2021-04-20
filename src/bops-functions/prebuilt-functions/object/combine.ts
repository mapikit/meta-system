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
  description: "Combine two objects into one, with the latter object overriding conflicting keys",
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
    { name: "object1", type: "cloudedObject", required: true },
    { name: "object2", type: "cloudedObject", required: true },
  ],
  customTypes: [],
};
