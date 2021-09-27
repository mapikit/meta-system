import { InternalMetaFunction } from "../../internal-meta-function";

export const lowerThanBopsFunction = (input : { A : number; B : number }) : unknown => {
  const isLower = input.A < input.B;

  return ({ isLower });
};

export const lowerThanBopsFunctionInformation : InternalMetaFunction = {
  functionName: "lowerThan",
  version: "1.0.0",
  description: "compares A to B, returning if A is lower than B",
  inputParameters: {
    A: { type: "number", required: true },
    B: { type: "number", required: true },
  },
  outputData: {
    isLower: { type: "boolean", required: true },
  },
};
