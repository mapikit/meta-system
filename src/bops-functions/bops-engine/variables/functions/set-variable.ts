import { InternalMetaFunction } from "../../../internal-meta-function";
import { ResolvedVariables } from "../variables-context";

type SetVariableInput = { variableName : string; value : unknown };

export function setVariableFunction (input : SetVariableInput, variables : ResolvedVariables) : unknown {
  const foundVariable = variables[input.variableName];

  if(foundVariable === undefined) {
    return { errorMessage: `No variable named "${input.variableName}" was found` };
  }

  const isValidType = typeof input.value === foundVariable.type;
  if(!isValidType) {
    return { errorMessage: `Type "${typeof input.value}" is not compatible with "${foundVariable.type}"` };
  }

  foundVariable.value = input.value;
  return { newValue: variables[input.variableName].value };
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
