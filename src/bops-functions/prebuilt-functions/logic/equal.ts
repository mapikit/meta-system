import { InternalMetaFunction } from "../../internal-meta-function.js";
// TODO Possibly make this browser compatible (impossible with util import)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isEqualToBopsFunction = async (input : { A : any; B : any }) : Promise<unknown> => {
  const { isDeepStrictEqual } = await import("util");
  const isEqual = isDeepStrictEqual(input.A, input.B);

  return ({ isEqual });
};

export const isEqualToBopsFunctionInformation : InternalMetaFunction = {
  functionName: "equalTo",
  description: "compares A to B, returning if A is lower than B",
  input: {
    A: { type: "any", required: true },
    B: { type: "any", required: true },
  },
  output: {
    isEqual: { type: "boolean", required: true  },
  },
};
