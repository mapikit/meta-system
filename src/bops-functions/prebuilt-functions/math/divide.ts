import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";
import { anyIsNan } from "@api/bops-functions/prebuilt-functions/non-bops-utils/any-is-nan";
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

export const subtractFunctionInformation : InternalMetaFunction = {
  functionName: "divideBopsFunction",
  version: "1.0.0",
  description: "Divides A by B",
  outputData: [
    {
      type: "number",
      name: "result",
      branch: "result",
    },
    {
      type: "string",
      name: "errorNaN",
      branch: "notANumber",
    },
    {
      type: "string",
      name: "errorDivideByZero",
      branch: "bIsZero",
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
      branchName: "bIsZero",
    },
  ],
  inputParameters: [
    { name: "A", type: "number" },
    { name: "B", type: "number" },
  ],
  customTypes: [],
};
