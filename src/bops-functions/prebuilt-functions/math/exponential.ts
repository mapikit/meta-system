import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";
import Decimal from "decimal.js";
import { anyIsNan } from "@api/bops-functions/prebuilt-functions/non-bops-utils/any-is-nan";

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
  functionName: "exponentialBopsFunction",
  version: "1.0.0",
  description: "Raises A to the power of B",
  outputData: [
    {
      type: "number",
      name: "result",
      branch: "result",
    },
    {
      type: "string",
      name: "errorMessage",
      branch: "notANumber",
    },
  ],
  outputBranches: [
    {
      branchName: "result",
    },
    {
      branchName: "notANumber",
    },
  ],
  inputParameters: [
    { name: "A", type: "number" },
    { name: "B", type: "number" },
  ],
  customTypes: [],
};
