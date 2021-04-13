import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";
import { getGreatestDecimalPlaces }
  from "@api/bops-functions/prebuilt-functions/non-bops-utils/get-largest-decimal-places";
import { anyIsNan } from "@api/bops-functions/prebuilt-functions/non-bops-utils/any-is-nan";

export const modulusBopsFunction = (input : { A : number; B : number }) : unknown => {
  if (anyIsNan(input.A, input.B)) {
    return ({ errorMessage: "One of the arguments provided was not a number" });
  }

  const decimalPlaces = Math.pow(10, getGreatestDecimalPlaces(input.A, input.B));
  const A = input.A * decimalPlaces;
  const B = input.B * decimalPlaces;
  const result = (A%B) / decimalPlaces;

  return ({ result });
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
