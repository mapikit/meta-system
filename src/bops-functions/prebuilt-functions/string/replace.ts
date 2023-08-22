import { InternalMetaFunction } from "../../internal-meta-function.js";

export const stringReplaceFunction = (input : { baseString : string; search : string; replacer : string })
: unknown => {
  let result = input.baseString;
  while (result.includes(input.search)) {
    result = result.replace(input.search, input.replacer);
  }
  return ({ result });
};

export const stringReplaceFunctionInformation : InternalMetaFunction = {
  functionName: "stringReplace",
  description: "Replaces a part of a string",
  input: {
    baseString: { type: "string", required: true },
    search: { type: "string", required: true },
    replacer: { type: "string", required: true },
  },
  output: {
    result: { type: "string", required: true },
  },
};
