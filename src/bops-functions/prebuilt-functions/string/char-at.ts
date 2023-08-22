import { InternalMetaFunction } from "../../internal-meta-function.js";

export const charAtBopsFunction = (input : { string : string; index : number }) : unknown => {
  const found = input.string[input.index];

  if (found === undefined) {
    return ({ notFoundMessage: "There is no character present at the given index" });
  }

  return ({ found });
};

export const charAtBopsFunctionInformation : InternalMetaFunction = {
  functionName: "charAt",
  description: "Gets the character in the string at the index given",
  input: {
    string: { type: "string", required: true },
    index: { type: "number", required: true },
  },
  output: {
    found: { type: "string", required: false },
    notFoundMessage: { type: "string", required: false },
  },
};
