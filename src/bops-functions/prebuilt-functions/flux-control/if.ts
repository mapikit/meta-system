import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

type InputType = {
  boolean : boolean;
  ifTrue : Function | unknown;
  ifFalse : Function | unknown;
}

async function getValue (valueOrFunction : Function | unknown) : Promise<unknown> {
  if(typeof valueOrFunction === "function") return valueOrFunction();
  return valueOrFunction;
}

export const ifBopsFunction = async (input : InputType) : Promise<unknown> => {
  const isBooleanTrue = input.boolean;
  const outputValue = isBooleanTrue ? await getValue(input.ifTrue) : await getValue(input.ifFalse);

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