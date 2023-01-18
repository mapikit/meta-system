import { InternalMetaFunction } from "../../internal-meta-function";
import { CloudedObject } from "../../../common/types/clouded-object";

export const getObjectValuesBopsFunction = (input : { object : CloudedObject }) : unknown => {
  const result = [];

  Object.values(input.object).forEach((value) => {
    result.push(value);
  });

  return ({ values: result });
};

export const getObjectValuesBopsFunctionInformation : InternalMetaFunction = {
  functionName: "getObjectValues",
  version: "1.0.0",
  description: "Get a list of the values of the given object",
  input: {
    object: { type: "cloudedObject",  required: true  },
  },
  output: {
    values: { type: "array", subtype: "any",  required: true },
  },
};
