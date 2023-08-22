import { InternalMetaFunction } from "../../internal-meta-function.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNillBopsFunction = (input : { value : any }) : unknown => {
  const isNill = input.value === undefined || input.value === null;

  return ({ isNill });
};

export const isNillBopsFunctionInformation : InternalMetaFunction = {
  functionName: "isNill",
  description: "Evaluates true if the value provided is undefined or null.",
  input: {
    value: { type: "any", required: true },
  },
  output: {
    isNill: { type: "boolean", required: true  },
  },
};
