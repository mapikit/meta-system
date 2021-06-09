import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";
import { isDeepStrictEqual } from "util";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isEqualToBopsFunction = (input : { A : any; B : any }) : unknown => {
  const isEqual = isDeepStrictEqual(input.A, input.B);

  return ({ isEqual });
};

export const isEqualToBopsFunctionInformation : InternalMetaFunction = {
  functionName: "isEqualToBopsFunction",
  version: "1.0.0",
  description: "compares A to B, returning if A is lower than B",
  inputParameters: {
    A: { type: "any", required: true },
    B: { type: "any", required: true },
  },
  outputData: {
    isEqual: { type: "boolean", required: true  },
  },
};
