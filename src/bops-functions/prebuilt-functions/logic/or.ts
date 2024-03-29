import { InternalMetaFunction } from "../../internal-meta-function.js";

export const orGateBopsFunction = (input : { A : boolean; B : boolean }) : unknown => {
  const eitherAreTrue = input.A || input.B;

  return ({ eitherIsTrue: eitherAreTrue });
};

export const orGateBopsFunctionInformation : InternalMetaFunction = {
  functionName: "or",
  description: "OR gate comparing boolean values for A and B",
  output: {
    eitherIsTrue: { type: "boolean", required: true },
  },
  input: {
    A: { type: "boolean", required: true },
    B: { type: "boolean", required: true },
  },
};
