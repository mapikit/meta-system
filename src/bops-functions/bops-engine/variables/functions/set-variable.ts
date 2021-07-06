import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export function setVariableFunction (input : { variableName : string; value : unknown }) : unknown {
  const foundVariable = this.variables[input.variableName];
  const isValidType = typeof input.value === foundVariable.type;
  if(!isValidType) throw new Error("asdasd");

  foundVariable.value = input.value;
  return { newValue: this.variables[input.variableName] };
}

export const setVariableFunctionInformation : InternalMetaFunction = {
  functionName: "setVariable",
  version: "1.0.0",
  description: "Sets the referenced variable to the new value",
  inputParameters: {
    variableName: { type: "string", required: true },
    value: { type: "any", required: true },
  },
  outputData: {
    newValue: { type: "any", required: true },
  },
};
