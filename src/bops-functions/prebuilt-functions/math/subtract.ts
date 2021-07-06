import { InternalMetaFunction } from "../../internal-meta-function";
import { anyIsNan } from "../non-bops-utils/any-is-nan";
import Decimal from "decimal.js";

export const subtractBopsFunction = (input : { A : number; B : number }) : unknown => {
  if (anyIsNan(input.A, input.B)) {
    return ({ errorMessage: "One of the arguments provided was not a number" });
  }

  const result = new Decimal(input.A).sub(new Decimal(input.B));

  return ({ result: result.toNumber() });
};

export const subtractFunctionInformation : InternalMetaFunction = {
  functionName: "subtractBopsFunction",
  version: "1.0.0",
  description: "Subtracts B from A",
  inputParameters: {
    A: { type: "number",  required: true },
    B: { type: "number",  required: true },
  },
  outputData: {
    result: { type: "number",  required: false },
    errorMessage: { type: "string",  required: false },
  },
};
