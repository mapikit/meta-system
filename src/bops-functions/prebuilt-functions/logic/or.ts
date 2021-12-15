import { InternalMetaFunction } from "../../internal-meta-function";

export const orGateBopsFunction = (input : { A : boolean; B : boolean }) : unknown => {
  const eitherAreTrue = input.A || input.B;

  return ({ eitherIsTrue: eitherAreTrue });
};

export const orGateBopsFunctionInformation : InternalMetaFunction = {
  functionName: "or",
  version: "1.0.0",
  description: "OR gate comparing boolean values for A and B",
  output: {
    eitherIsTrue: { type: "boolean", required: true },
  },
  input: {
    A: { type: "boolean", required: true },
    B: { type: "boolean", required: true },
  },
};
