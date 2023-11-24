import { InternalMetaFunction } from "../../internal-meta-function.js";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isEqualToBopsFunction = (input : { A : any; B : any }) : unknown => {
  if(typeof input.A === "object" && typeof input.B === "object") {
    return { isEqual: JSON.stringify(input.A) === JSON.stringify(input.B) };
  }

  const isEqual = input.A === input.B;
  return ({ isEqual });
};

export const isEqualToBopsFunctionInformation : InternalMetaFunction = {
  functionName: "equalTo",
  description: "compares A to B, returning if A is lower than B",
  input: {
    A: { type: "any", required: true },
    B: { type: "any", required: true },
  },
  output: {
    isEqual: { type: "boolean", required: true  },
  },
};
