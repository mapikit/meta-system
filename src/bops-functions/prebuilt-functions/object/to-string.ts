import { InternalMetaFunction } from "../../internal-meta-function.js";
import { CloudedObject } from "../../../common/types/clouded-object.js";

export const objectToStringBopsFunction = (input : { object : CloudedObject }) : unknown => {
  return ({ result: JSON.stringify(input.object) });
};

export const objectToStringBopsFunctionInformation : InternalMetaFunction = {
  functionName: "objectToString",
  description: "Transforms an object into a JSON-like string",
  input: {
    object: { type: "cloudedObject",  required: true  },
  },
  output: {
    result: { type: "string",  required: true },
  },
};
