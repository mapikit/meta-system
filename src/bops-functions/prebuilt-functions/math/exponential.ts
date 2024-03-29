import { InternalMetaFunction } from "../../internal-meta-function.js";
import { Decimal } from "decimal.js";
import { anyIsNan } from "../non-bops-utils/any-is-nan.js";

export const exponentialBopsFunction = (input : { A : number; B : number}) : unknown => {
  if (anyIsNan(input.A, input.B)) {
    return ({ errorMessage: "One of the arguments provided was not a number" });
  }

  const A = new Decimal(input.A);
  const B = new Decimal(input.B);

  const result = A.pow(B);

  return ({ result: result.toNumber() });
};

export const exponentialFunctionInformation : InternalMetaFunction = {
  functionName: "exponential",
  description: "Raises A to the power of B",
  input: {
    A: { type: "number", required: true },
    B: { type: "number", required: true },
  },
  output: {
    result: { type: "number", required: false },
    errorMessage: { type: "string", required: false },
  },
};
