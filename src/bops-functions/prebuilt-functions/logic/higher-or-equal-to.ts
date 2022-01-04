import { InternalMetaFunction } from "../../internal-meta-function";

export const higherOrEqualToBopsFunction = (input : { A : number; B : number }) : unknown => {
  const isHigherOrEqual = input.A >= input.B;

  return ({ isHigherOrEqual });
};

export const higherOrEqualToBopsFunctionInformation : InternalMetaFunction = {
  functionName: "higherOrEqualTo",
  version: "1.0.0",
  description: "compares A to B, returning if A is higher or equal to B",
  input: {
    A: { type: "number", required: true },
    B: { type: "number", required: true },
  },
  output: {
    isHigherOrEqual: { type: "boolean", required: true },
  },
};
