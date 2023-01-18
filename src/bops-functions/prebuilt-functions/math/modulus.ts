import { InternalMetaFunction } from "../../internal-meta-function";
import { anyIsNan } from "../non-bops-utils/any-is-nan";
import Decimal from "decimal.js";

export const modulusBopsFunction = (input : { A : number; B : number }) : unknown => {
  if (input.B === 0) {
    return({ errorDivisionByZero: "Cannot Divide By Zero" });
  }

  if (anyIsNan(input.A, input.B)) {
    return ({ errorNotANumber: "One of the arguments provided was not a number" });
  }

  const A = new Decimal(input.A);
  const B = new Decimal(input.B);
  const result = A.mod(B);

  return ({ result: result.toNumber() });
};

export const modulusFunctionInformation : InternalMetaFunction = {
  functionName: "modulus",
  version: "1.0.0",
  description: "Gets the remainder of the division of A by B",
  input: {
    A: { type: "number", required: true },
    B: { type: "number", required: true },
  },
  output: {
    result: { type: "number", required: false },
    errorNotANumber: { type: "string", required: false },
    errorDivisionByZero: { type: "string", required: false },
  },
};
