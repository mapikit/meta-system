import { InternalMetaFunction } from "@api/bops-functions/internal-meta-function";

export function decreaseVariableFunction (input : { variableName : string; value ?: number }) : unknown {
  if(typeof this.variables[input.variableName] !== "number") throw new Error("Invalid variable type");

  this.variables[input.variableName] -= input.value;
  return { newValue: this.variables[input.variableName] };
}

export const decreaseVariableFunctionInformation : InternalMetaFunction = {
  functionName: "decreaseVariable",
  version: "1.0.0",
  description: "Decreases the referenced variable value by the given amount (defaults to 1)",
  inputParameters: {
    variableName: { type: "string", required: true },
    value: { type: "number", required: true },
  },
  outputData: {
    newValue: { type: "number", required: true },
  },
};