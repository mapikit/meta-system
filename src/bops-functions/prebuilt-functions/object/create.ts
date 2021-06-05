import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const createObjectBopsFunction = (input : { key ?: string; value ?: unknown }) : unknown => {
  const resultObject = {};

  if (input.key !== undefined) {
    resultObject[input.key] = input.value;
  }

  return ({ created: resultObject });
};

export const createObjectBopsFunctionInformation : InternalMetaFunction = {
  functionName: "createObjectBopsFunction",
  version: "1.0.0",
  description: "Creates an object with the given key and value",
  inputParameters: {
    key: { type: "string",  required: false  },
    value: { type: "any",  required: false  },
  },
  outputData: {
    created: { type: "cloudedObject",  required: true },
  },
};
