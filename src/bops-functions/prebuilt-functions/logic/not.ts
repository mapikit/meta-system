import { InternalMetaFunction } from "../../internal-meta-function";

export const notBopsFunction = (input : { A : boolean }) : unknown => {
  return ({ result: !input.A });
};

export const notBopsFunctionInformation : InternalMetaFunction = {
  functionName: "not",
  version: "1.0.0",
  description: "Inverts the boolean value of A",
  input: {
    A: { type: "boolean", required: true },
  },
  output: {
    result: { type: "boolean", required: true },
  },
};
