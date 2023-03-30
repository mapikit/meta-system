import { InternalMetaFunction } from "../../internal-meta-function.js";
import { CloudedObject } from "../../../common/types/clouded-object.js";


export const combineObjectBopsFunction = (input : { object1 : CloudedObject; object2 : CloudedObject }) : unknown => {
  const resultObject = {};

  Object.assign(resultObject, input.object1);
  Object.assign(resultObject, input.object2);

  return ({ combined: resultObject });
};

export const combineObjectBopsFunctionInformation : InternalMetaFunction = {
  functionName: "combineObject",
  version: "1.0.0",
  description: "Combine two objects into one, with the latter object overriding conflicting keys",
  input: {
    object1: { type: "cloudedObject",  required: true  },
    object2: { type: "cloudedObject",  required: true  },
  },
  output: {
    combined: { type: "cloudedObject",  required: true },
  },
};
