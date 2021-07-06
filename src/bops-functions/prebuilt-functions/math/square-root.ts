import { InternalMetaFunction } from "src/bops-functions/internal-meta-function";
import Decimal from "decimal.js";
import { anyIsNan } from "@api/bops-functions/prebuilt-functions/non-bops-utils/any-is-nan";

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
  functionName: "squareRootBopsFunction",
  version: "1.0.0",
  description: "Gets the Square Root of A",
  inputParameters: {
    A: { type: "number",  required: true },
  },
  outputData: {
    result: { type: "number",  required: false },
    errorNaN: { type: "string",  required: false },
    errorNegativeA: { type: "string",  required: false },
  },
};
