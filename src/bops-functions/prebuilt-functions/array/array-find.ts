import { InternalMetaFunction } from "../../internal-meta-function.js";

export const arrayFindBopsFunction = (input : { array : unknown[]; finder : Function }) : unknown => {
  let found = false;

  if (typeof input.finder !== "function") {
    return { errorMessage: "No finder function provided", found };
  }

  const result = input.array.find((item, index, array) => input.finder({ item, index, array }));
  found = !!result;

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result,
    found,
  };
};

export const arrayFindBopsFunctionInformation : InternalMetaFunction = {
  functionName: "arrayFind",
  description: "Find a value in the array",
  input: {
    array: { type: "array", subtype: "any", required: true },
    finder: { type: "function", required: true },
  },
  output: {
    found : { type : "boolean", required: true },
    result: { type: "array", subtype: "any", required: false },
    errorMessage: { type: "string", required: false },
  },
};
