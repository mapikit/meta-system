import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";
import { CloudedObject } from "@api/common/types/clouded-object";

export const objectToStringBopsFunction = (input : { object : CloudedObject }) : unknown => {
  return ({ result: JSON.stringify(input.object) });
};

export const objectToStringBopsFunctionInformation : InternalMetaFunction = {
  functionName: "objectToStringBopsFunction",
  version: "1.0.0",
  description: "Transforms an object into a JSON-like string",
  inputParameters: {
    object: { type: "cloudedObject",  required: true  },
  },
  outputData: {
    result: { type: "string",  required: true },
  },
};
