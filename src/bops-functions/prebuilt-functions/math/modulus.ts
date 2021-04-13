import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";
import { anyIsNan } from "@api/bops-functions/prebuilt-functions/non-bops-utils/any-is-nan";
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
  functionName: "modulusBopsFunction",
  version: "1.0.0",
  description: "Gets the remainder of the division of A by B",
  outputData: [
    {
      type: "number",
      name: "result",
      branch: "result",
    },
    {
      type: "string",
      name: "errorNotANumber",
      branch: "notANumber",
    },
    {
      type: "string",
      name: "errorDivisionByZero",
      branch: "divisionByZero",
    },
  ],
  outputBranches: [
    {
      branchName: "result",
    },
    {
      branchName: "notANumber",
    },
    {
      branchName: "divisionByZero",
    },
  ],
  inputParameters: [
    { name: "A", type: "number" },
    { name: "B", type: "number" },
  ],
  customTypes: [],
};