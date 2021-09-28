import { InternalMetaFunction } from "../../internal-meta-function";
import { CloudedObject } from "../../../common/types/clouded-object";

export const objectToStringBopsFunction = (input : { object : CloudedObject }) : unknown => {
  return ({ result: JSON.stringify(input.object) });
};

export const objectToStringBopsFunctionInformation : InternalMetaFunction = {
  functionName: "objectToString",
  version: "1.0.0",
  description: "Transforms an object into a JSON-like string",
  inputParameters: {
    object: { type: "cloudedObject",  required: true  },
  },
  outputData: {
    result: { type: "string",  required: true },
  },
};
