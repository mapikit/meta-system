import { InternalMetaFunction } from "../../internal-meta-function.js";

export const andGateBopsFunction = (input : { A : boolean; B : boolean }) : unknown => {
  const bothTrue = input.A && input.B;

  return ({ bothTrue });
};

export const andGateBopsFunctionInformation : InternalMetaFunction = {
  functionName: "and",
  version: "1.0.0",
  description: "And gate comparing boolean values for A and B",
  input: {
    A: { type: "boolean", required: true },
    B: { type: "boolean", required: true },
  },
  output: {
    bothTrue: { type: "boolean", required: true },
  },
};
