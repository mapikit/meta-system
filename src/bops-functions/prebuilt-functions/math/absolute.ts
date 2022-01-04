import { InternalMetaFunction } from "../../internal-meta-function";

export const absoluteBopsFunction = (input : { input : number }) : unknown => {
  const result = Math.abs(input.input);

  if (Number.isNaN(Number(result))) {
    return ({ errorMessage: "One of the arguments provided was not a number" });
  }

  return ({ result });
};

export const absoluteFunctionInformation : InternalMetaFunction = {
  functionName: "absolute",
  version: "1.0.0",
  description: "Gets the absolute value of a number",
  input: {
    input: { type: "number", required: true },
  },
  output: {
    result: { type: "number", required: false },
    errorMessage: { type: "string", required: false },
  },
};
