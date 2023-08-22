import { InternalMetaFunction } from "../../internal-meta-function.js";
import { CloudedObject } from "../../../common/types/clouded-object.js";


export const getObjectPropertyValueBopsFunction = (input : { object : CloudedObject; key : string }) : unknown => {
  const resultObject = {};

  Object.assign(resultObject, input.object);

  return ({ value: resultObject[input.key] });
};

export const getObjectPropertyValueBopsFunctionInformation : InternalMetaFunction = {
  functionName: "getObjectPropertyValue",
  description: "Get a value of an object's propery by one Key",
  input: {
    object: { type: "cloudedObject",  required: true  },
    key: { type: "string",  required: true  },
  },
  output: {
    value: { type: "cloudedObject",  required: true },
  },
};
