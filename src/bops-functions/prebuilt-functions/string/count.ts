import { InternalMetaFunction } from "../../internal-meta-function.js";

export const countStringFunction = (input : { string : string; search : string }) : unknown => {
  let count = 0;
  const skipLength = input.search.length;

  for (let i = 0; i <= input.string.length -1; i++) {
    const index = input.string.indexOf(input.search, i);
    if (index < 0) break;

    count ++;

    i += skipLength + index;
  }

  return ({ count });
};

export const countStringFunctionInformation : InternalMetaFunction = {
  functionName: "countString",
  description: "Gets the amount of times a substring appears in the string",
  input: {
    string: { type: "string", required: true },
    search: { type: "string", required: true },
  },
  output: {
    count: { type: "number", required: true },
  },
};
