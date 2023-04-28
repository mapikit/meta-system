import { InternalMetaFunction } from "../../internal-meta-function.js";
import { anyIsNan } from "../non-bops-utils/any-is-nan.js";
import { Decimal } from "decimal.js";

export const subtractBopsFunction = (input : { A : number; B : number }) : unknown => {
  if (anyIsNan(input.A, input.B)) {
    return ({ errorMessage: "One of the arguments provided was not a number" });
  }

  const result = new Decimal(input.A).sub(new Decimal(input.B));

  return ({ result: result.toNumber() });
};

export const subtractFunctionInformation : InternalMetaFunction = {
  functionName: "subtract",
  description: "Subtracts B from A",
  input: {
    A: { type: "number",  required: true },
    B: { type: "number",  required: true },
  },
  output: {
    result: { type: "number",  required: false },
    errorMessage: { type: "string",  required: false },
  },
};
