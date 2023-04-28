import { InternalMetaFunction } from "../../internal-meta-function.js";

export const notBopsFunction = (input : { A : boolean }) : unknown => {
  return ({ result: !input.A });
};

export const notBopsFunctionInformation : InternalMetaFunction = {
  functionName: "not",
  description: "Inverts the boolean value of A",
  input: {
    A: { type: "boolean", required: true },
  },
  output: {
    result: { type: "boolean", required: true },
  },
};
