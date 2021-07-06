import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export function increaseVariableFunction (input : { variableName : string; value ?: number }) : unknown {
  if(typeof this.variables[input.variableName] !== "number") {
    return { errorMessage: `Input value ${input.value} is not a number` };
  }

  this.variables[input.variableName] += input.value;
  return { newValue: this.variables[input.variableName] };
}

export const increaseVariableFunctionInformation : InternalMetaFunction = {
  functionName: "increaseVariable",
  version: "1.0.0",
  description: "Increases the referenced variable value by the given amount (defaults to 1)",
  inputParameters: {
    variableName: { type: "string", required: true },
    value: { type: "number", required: true },
  },
  outputData: {
    newValue: { type: "number", required: false },
    errorMessage: { type: "string", required: false },
  },
};
