import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const notBopsFunction = (input : { A : boolean }) : unknown => {
  return ({ result: !input.A });
};

export const notBopsFunctionInformation : InternalMetaFunction = {
  functionName: "notBopsFunction",
  version: "1.0.0",
  description: "Inverts the boolean value of A",
  inputParameters: {
    A: { type: "boolean", required: true },
  },
  outputData: {
    result: { type: "boolean", required: true },
  },
};
