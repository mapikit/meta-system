import { InternalMetaFunction } from "../../internal-meta-function";
import { CloudedObject } from "../../../common/types/clouded-object";


export const getObjectKeysBopsFunction = (input : { object : CloudedObject }) : unknown => {
  const result = [];

  Object.keys(input.object).forEach((keyName) => {
    result.push(keyName.toString());
  });

  return ({ keys: result });
};

export const getObjectKeysBopsFunctionInformation : InternalMetaFunction = {
  functionName: "getObjectKeys",
  version: "1.0.0",
  description: "Get a list of the keys of the given object",
  inputParameters: {
    object: { type: "cloudedObject",  required: true  },
  },
  outputData: {
    keys: { type: "array", subtype: "string",  required: true },
  },
};
