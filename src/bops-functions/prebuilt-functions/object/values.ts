import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";
import { CloudedObject } from "@api/common/types/clouded-object";

export const getObjectValuesBopsFunction = (input : { object : CloudedObject }) : unknown => {
  const result = [];

  Object.values(input.object).forEach((value) => {
    result.push(value);
  });

  return ({ values: result });
};

export const getObjectValuesBopsFunctionInformation : InternalMetaFunction = {
  functionName: "getObjectValuesBopsFunction",
  version: "1.0.0",
  description: "Get a list of the values of the given object",
  inputParameters: {
    object: { type: "cloudedObject",  required: true  },
  },
  outputData: {
    values: { type: "array.any",  required: true },
  },
};
