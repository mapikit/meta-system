import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export function setVariableFunction (input : { variableName : string; value : unknown }) : unknown {
  const foundVariable = this.variables[input.variableName];
  const isValidType = typeof input.value === foundVariable.type;
  if(!isValidType) {
    return { errorMessage: `Type "${typeof input.value}" is not compatible with "${foundVariable.type}"` };
  }

  foundVariable.value = input.value;
  return { newValue: this.variables[input.variableName].value };
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
    newValue: { type: "any", required: false },
    errorMessage: { type: "string", required: false },
  },
};
