import { InternalMetaFunction } from "../../internal-meta-function";
import { anyIsNan } from "../non-bops-utils/any-is-nan";
import Decimal from "decimal.js";

export const divideBopsFunction = (input : { A : number; B : number }) : unknown => {
  if (input.B === 0) {
    return ({ errorDivideByZero: "Cannot divide by zero" });
  }

  if (anyIsNan(input.B, input.A)) {
    return ({ errorNaN: "One of the arguments provided was not a number" });
  }

  const A = new Decimal(input.A);
  const B = new Decimal(input.B);
  const result = A.div(B);

  return ({ result: result.toNumber() });
};

export const divideFunctionInformation : InternalMetaFunction = {
  functionName: "divide",
  version: "1.0.0",
  description: "Divides A by B",
  inputParameters: {
    A: { type: "number", required: true },
    B: { type: "number", required: true },
  },
  outputData: {
    result: { type: "number", required: false },
    errorNaN: { type: "string", required: false },
    errorDivideByZero: { type: "string",  required: false },
  },
};
