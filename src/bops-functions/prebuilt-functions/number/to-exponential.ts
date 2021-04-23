import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";
import Decimal from "decimal.js";

export const toExponentialBopsFunction = (input : { number : number; decimalPlaces ?: number }) : unknown => {
  if (Number.isNaN(input.number)) {
    return ({ errorMessage: "Cannot make NaN exponential" });
  }

  const decimalPlaces = Number.isNaN(Number(input.decimalPlaces)) ? undefined : input.decimalPlaces;

  if (decimalPlaces !== undefined) {
    return ({ result: new Decimal(input.number).toExponential(decimalPlaces, Decimal.ROUND_HALF_UP) });
  }

  return ({ result: new Decimal(input.number).toExponential() });
};

export const toExponentialBopsFunctionInformation : InternalMetaFunction = {
  functionName: "toExponentialBopsFunction",
  version: "1.0.0",
  description: "Gets the index of a substring in the string",
  outputData: [
    {
      type: "number",
      name: "result",
      branch: "default",
    },
    {
      type: "string",
      name: "errorMessage",
      branch: "errorNaN",
    },
  ],
  outputBranches: [
    {
      branchName: "default",
    },
    {
      branchName: "errorNaN",
    },
  ],
  inputParameters: [
    { name: "string", type: "string", required: true },
    { name: "decimalPlaces", type: "number", required: false },
  ],
  customTypes: [],
};
