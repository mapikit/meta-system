import { InternalMetaFunction } from "../../internal-meta-function";

export const lowerOrEqualToBopsFunction = (input : { A : number; B : number }) : unknown => {
  const isLowerOrEqual = input.A <= input.B;


  return ({ isLowerOrEqual });
};

export const lowerOrEqualToBopsFunctionInformation : InternalMetaFunction = {
  functionName: "lowerOrEqualTo",
  version: "1.0.0",
  description: "compares A to B, returning if A is lower or equal to B",
  inputParameters: {
    A: { type: "number", required: true },
    B: { type: "number", required: true },
  },
  outputData: {
    isLowerOrEqual: { type: "boolean", required: true },
  },
};
