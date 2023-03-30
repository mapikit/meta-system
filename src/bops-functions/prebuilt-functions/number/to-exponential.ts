import { InternalMetaFunction } from "../../internal-meta-function.js";
import { Decimal } from "decimal.js";

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
  functionName: "toExponential",
  version: "1.0.0",
  description: "Gets the index of a substring in the string",
  output: {
    result: { type: "number", required: false },
    errorMessage : { type: "string", required: false },
  },
  input: {
    string: { type: "string", required: true },
    decimalPlaces: { type: "number", required: false },
  },
};
