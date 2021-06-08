import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const orGateBopsFunction = (input : { A : boolean; B : boolean }) : unknown => {
  const eitherAreTrue = input.A || input.B;

  return ({ eitherIsTrue: eitherAreTrue });
};

export const orGateBopsFunctionInformation : InternalMetaFunction = {
  functionName: "orGateBopsFunction",
  version: "1.0.0",
  description: "OR gate comparing boolean values for A and B",
  outputData: {
    eitherIsTrue: { type: "boolean", required: true },
  },
  inputParameters: {
    A: { type: "boolean", required: true },
    B: { type: "boolean", required: true },
  },
};
