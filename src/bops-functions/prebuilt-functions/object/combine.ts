import { InternalMetaFunction } from "../../internal-meta-function";
import { CloudedObject } from "../../../common/types/clouded-object";


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
  inputParameters: {
    object1: { type: "cloudedObject",  required: true  },
    object2: { type: "cloudedObject",  required: true  },
  },
  outputData: {
    combined: { type: "cloudedObject",  required: true },
  },
};
