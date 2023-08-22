import { InternalMetaFunction } from "../../internal-meta-function.js";
import { CloudedObject } from "../../../common/types/clouded-object.js";


export const getObjectKeysBopsFunction = (input : { object : CloudedObject }) : unknown => {
  const result = [];

  Object.keys(input.object).forEach((keyName) => {
    result.push(keyName.toString());
  });

  return ({ keys: result });
};

export const getObjectKeysBopsFunctionInformation : InternalMetaFunction = {
  functionName: "getObjectKeys",
  description: "Get a list of the keys of the given object",
  input: {
    object: { type: "cloudedObject",  required: true  },
  },
  output: {
    keys: { type: "array", subtype: "string",  required: true },
  },
};
