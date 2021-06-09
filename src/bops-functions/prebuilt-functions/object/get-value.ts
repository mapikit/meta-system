import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";
import { CloudedObject } from "@api/common/types/clouded-object";

export const getObjectPropertyValueBopsFunction = (input : { object : CloudedObject; key : string }) : unknown => {
  const resultObject = {};

  Object.assign(resultObject, input.object);

  return ({ value: resultObject[input.key] });
};

export const getObjectPropertyValueBopsFunctionInformation : InternalMetaFunction = {
  functionName: "getObjectPropertyValueBopsFunction",
  version: "1.0.0",
  description: "Get a value of an object's propery by one Key",
  inputParameters: {
    object: { type: "cloudedObject",  required: true  },
    key: { type: "string",  required: true  },
  },
  outputData: {
    value: { type: "cloudedObject",  required: true },
  },
};
