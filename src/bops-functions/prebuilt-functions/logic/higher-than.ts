import { InternalMetaFunction } from "../../internal-meta-function";

export const higherThanBopsFunction = (input : { A : number; B : number }) : unknown => {
  const isHigher = input.A > input.B;

  return ({ isHigher });
};

export const higherThanBopsFunctionInformation : InternalMetaFunction = {
  functionName: "higherThan",
  version: "1.0.0",
  description: "compares A to B, returning if A is higher than B",
  inputParameters: {
    A: { type: "number", required: true },
    B: { type: "number", required: true },
  },
  outputData: {
    isHigher: { type: "boolean", required: true },
  },
};
