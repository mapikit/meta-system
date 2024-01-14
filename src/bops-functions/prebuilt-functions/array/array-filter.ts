import { InternalMetaFunction } from "../../internal-meta-function.js";

export const arrayFilterBopsFunction = (input : { array : unknown[]; filter : Function }) : unknown => {
  if (typeof input.filter !== "function") {
    return { errorMessage: "No filter function provided" };
  }

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result: input.array.filter((item, index, array) => input.filter({ item, index, array }) as any),
  };
};

export const arrayFilterBopsFunctionInformation : InternalMetaFunction = {
  functionName: "arrayFilter",
  description: "Filter the values of an Array into another Array",
  input: {
    array: { type: "array", subtype: "any", required: true },
    filter: { type: "function", required: true },
  },
  output: {
    result: { type: "array", subtype: "any", required: false },
    errorMessage: { type: "string", required: false },
  },
};
