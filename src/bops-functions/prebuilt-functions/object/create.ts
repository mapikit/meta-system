import { InternalMetaFunction } from "../../internal-meta-function.js";

export const createObjectBopsFunction = (input : { key ?: string; value ?: unknown }) : unknown => {
  const resultObject = {};

  if (input.key !== undefined) {
    resultObject[input.key] = input.value;
  }

  return ({ created: resultObject });
};

export const createObjectBopsFunctionInformation : InternalMetaFunction = {
  functionName: "createObject",
  description: "Creates an object with the given key and value",
  input: {
    key: { type: "string",  required: false  },
    value: { type: "any",  required: false  },
  },
  output: {
    created: { type: "cloudedObject",  required: true },
  },
};
