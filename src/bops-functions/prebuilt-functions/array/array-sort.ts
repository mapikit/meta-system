import clone from "just-clone";
import { InternalMetaFunction } from "../../internal-meta-function.js";

export const arraySortBopsFunction = (input : { array : unknown[]; sorter : Function }) : unknown => {
  if (typeof input.sorter !== "function") {
    return { errorMessage: "No sorter function provided" };
  }

  const resultArray = clone(input.array);

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result: resultArray.sort((a, b) => input.sorter({ a, b })),
  };
};

export const arraySortBopsFunctionInformation : InternalMetaFunction = {
  functionName: "arraySort",
  description: "Returns a copy of the input array, sorted by the sorter function",
  input: {
    array: { type: "array", subtype: "any", required: true },
    sorter: { type: "function", required: true },
  },
  output: {
    result: { type: "array", subtype: "any", required: false },
    errorMessage: { type: "string", required: false },
  },
};
