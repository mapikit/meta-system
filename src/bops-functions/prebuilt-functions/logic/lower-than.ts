import { InternalMetaFunction } from "../../internal-meta-function.js";

export const lowerThanBopsFunction = (input : { A : number; B : number }) : unknown => {
  const isLower = input.A < input.B;

  return ({ isLower });
};

export const lowerThanBopsFunctionInformation : InternalMetaFunction = {
  functionName: "lowerThan",
  description: "compares A to B, returning if A is lower than B",
  input: {
    A: { type: "number", required: true },
    B: { type: "number", required: true },
  },
  output: {
    isLower: { type: "boolean", required: true },
  },
};
