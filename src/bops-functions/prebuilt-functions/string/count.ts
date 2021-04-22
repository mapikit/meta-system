import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

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
  functionName: "countStringFunction",
  version: "1.0.0",
  description: "Gets the amount of times a substring appears in the string",
  outputData: [
    {
      type: "number",
      name: "count",
      branch: "default",
    },
  ],
  outputBranches: [
    {
      branchName: "default",
    },
  ],
  inputParameters: [
    { name: "string", type: "string", required: true },
    { name: "search", type: "string", required: true },
  ],
  customTypes: [],
};
