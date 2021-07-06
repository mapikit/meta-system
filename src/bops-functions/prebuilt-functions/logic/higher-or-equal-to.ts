import { InternalMetaFunction } from "src/bops-functions/internal-meta-function";

export const higherOrEqualToBopsFunction = (input : { A : number; B : number }) : unknown => {
  const isHigherOrEqual = input.A >= input.B;

  return ({ isHigherOrEqual });
};

export const higherOrEqualToBopsFunctionInformation : InternalMetaFunction = {
  functionName: "higherOrEqualToBopsFunction",
  version: "1.0.0",
  description: "compares A to B, returning if A is higher or equal to B",
  inputParameters: {
    A: { type: "number", required: true },
    B: { type: "number", required: true },
  },
  outputData: {
    isHigherOrEqual: { type: "boolean", required: true },
  },
};
