import { InternalMetaFunction } from "../../internal-meta-function.js";

export const arrayMapBopsFunction = (input : { array : unknown[]; mapper : Function }) : unknown => {
  if (typeof input.mapper !== "function") {
    return { errorMessage: "No mapper function provided" };
  }

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result: input.array.map((item, index, array) => input.mapper({ item, index, array }) as any),
  };
};

export const arrayMapBopsFunctionInformation : InternalMetaFunction = {
  functionName: "arrayMap",
  description: "Map the values of an Array into another Array",
  input: {
    array: { type: "array", subtype: "any", required: true },
    mapper: { type: "function", required: true },
  },
  output: {
    result: { type: "array", subtype: "any", required: false },
    errorMessage: { type: "string", required: false },
  },
};
