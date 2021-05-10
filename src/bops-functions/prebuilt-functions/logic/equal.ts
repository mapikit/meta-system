import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";
import { isDeepStrictEqual } from "util";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isEqualToBopsFunction = (input : { A : any; B : any }) : unknown => {
  const isEqual = isDeepStrictEqual(input.A, input.B);

  const isNotEqual = !isEqual;

  if (isEqual) return ({ isEqual });

  return ({ isNotEqual });
};

export const isEqualToBopsFunctionInformation : InternalMetaFunction = {
  functionName: "isEqualToBopsFunction",
  version: "1.0.0",
  description: "compares A to B, returning if A is lower than B",
  outputData: [
    {
      type: "boolean",
      name: "isEqual",
      branch: "isEqual",
    },
    {
      type: "boolean",
      name: "isNotEqual",
      branch: "isNotEqual",
    },
  ],
  outputBranches: [
    {
      branchName: "isEqual",
    },
    {
      branchName: "isNotEqual",
    },
  ],
  inputParameters: [
    { name: "A", type: "any", required: true },
    { name: "B", type: "any", required: true },
  ],
  customTypes: [],
};
