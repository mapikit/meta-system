import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";
import { getGreatestDecimalPlaces }
  from "@api/bops-functions/prebuilt-functions/non-bops-utils/get-largest-decimal-places";
import { anyIsNan } from "@api/bops-functions/prebuilt-functions/non-bops-utils/any-is-nan";

export const divideBopsFunction = (input : { A : number; B : number }) : unknown => {
  if (input.B === 0) {
    return ({ errorDivideByZero: "Cannot divide by zero" });
  }

  if (anyIsNan(input.B, input.A)) {
    return ({ errorNaN: "One of the arguments provided was not a number" });
  }

  const decimalPlaces = Math.pow(10, getGreatestDecimalPlaces(input.A, input.B));
  const A = input.A * decimalPlaces;
  const B = input.B * decimalPlaces;
  const result = (A/B) / decimalPlaces;

  return ({ result });
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
