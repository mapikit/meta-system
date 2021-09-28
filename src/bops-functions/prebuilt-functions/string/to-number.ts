import { InternalMetaFunction } from "../../internal-meta-function";

export const stringToNumberBopsFunction = (input : { string : string }) : unknown => {
  const result = Number(input.string);

  if (Number.isNaN(result)) {
    return ({ errorMessage: "Given string is not convertible to a number" });
  }

  return ({ result });
};

export const stringToNumberBopsFunctionInformation : InternalMetaFunction = {
  functionName: "stringToNumber",
  version: "1.0.0",
  description: "Converts a given string to a Number",
  inputParameters: {
    string: { type: "string", required: true },
  },
  outputData: {
    result: { type: "number", required: false },
    errorMessage: { type: "string", required: false },
  },
};
