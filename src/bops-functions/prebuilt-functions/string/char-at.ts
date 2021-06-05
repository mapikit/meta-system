import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export const charAtBopsFunction = (input : { string : string; index : number }) : unknown => {
  const found = input.string[input.index];

  if (found === undefined) {
    return ({ notFoundMessage: "There is no character present at the given index" });
  }

  return ({ found });
};

export const charAtBopsFunctionInformation : InternalMetaFunction = {
  functionName: "charAtBopsFunction",
  version: "1.0.0",
  description: "Gets the character in the string at the index given",
  inputParameters: {
    string: { type: "string", required: true },
    index: { type: "number", required: true },
  },
  outputData: {
    found: { type: "string", required: false },
    notFoundMessage: { type: "string", required: false },
  },
};
