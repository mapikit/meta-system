import { InternalMetaFunction } from "../../internal-meta-function.js";
import { Decimal } from "decimal.js";
import { anyIsNan } from "../non-bops-utils/any-is-nan.js";

export const squareRootBopsFunction = (input : { A : number }) : unknown => {
  if (anyIsNan(input.A)) {
    return ({ errorNaN: "One of the arguments provided was not a number" });
  }

  if (input.A < 0) {
    return ({ errorNegativeA: "Value must not be a negative number" });
  }

  const A = new Decimal(input.A);

  const result = A.squareRoot();

  return ({ result: result.toNumber() });
};

export const squareRootFunctionInformation : InternalMetaFunction = {
  functionName: "sqrt",
  description: "Gets the Square Root of A",
  input: {
    A: { type: "number",  required: true },
  },
  output: {
    result: { type: "number",  required: false },
    errorNaN: { type: "string",  required: false },
    errorNegativeA: { type: "string",  required: false },
  },
};
