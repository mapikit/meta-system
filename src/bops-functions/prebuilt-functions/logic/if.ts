import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

type InputType = {
  boolean : boolean;
  valueIfTrue : unknown;
  valueIfFalse : unknown;
}

export const ifBopsFunction = (input : InputType) : unknown => {
  const isBooleanTrue = input.boolean;
  const outputValue = isBooleanTrue ? input.valueIfTrue : input.valueIfFalse;

  return ({ outputValue });
};

export const ifBopsFunctionInformation : InternalMetaFunction = {
  functionName: "ifBopsFunction",
  version: "1.0.0",
  description: "Returns one of two given values based on whether the given boolean is true or false",
  inputParameters: {
    boolean : { type: "boolean", required: true },
    valueIfTrue : { type: "any", required: true },
    valueIfFalse : { type: "any", required: false },
  },
  outputData: {
    outputValue: { type: "any", required: true },
  },
};
