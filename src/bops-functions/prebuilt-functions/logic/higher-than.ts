import { InternalMetaFunction } from "../../internal-meta-function.js";

export const higherThanBopsFunction = (input : { A : number; B : number }) : unknown => {
  const isHigher = input.A > input.B;

  return ({ isHigher });
};

export const higherThanBopsFunctionInformation : InternalMetaFunction = {
  functionName: "higherThan",
  version: "1.0.0",
  description: "compares A to B, returning if A is higher than B",
  input: {
    A: { type: "number", required: true },
    B: { type: "number", required: true },
  },
  output: {
    isHigher: { type: "boolean", required: true },
  },
};
