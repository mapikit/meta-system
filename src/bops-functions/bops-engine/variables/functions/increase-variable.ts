import { CloudedObject } from "../../../../common/types/clouded-object";
import { InternalMetaFunction } from "../../../internal-meta-function";
import { ResolvedVariables } from "../variables-context";

export function increaseVariablesFunction (input : CloudedObject, variables : ResolvedVariables) : unknown {
  let updatedCount = 0;
  for(const variableName of Object.keys(input)) {
    const foundVariable = variables[variableName];

    if(foundVariable === undefined) {
      return { errorMessage: `No variable named "${input.variableName}" was found` };
    }

    if(typeof  input[variableName] !== "number" || foundVariable.type !== "number") {
      return { errorMessage: `Input value ${input[variableName]} is not a number` };
    }

    (foundVariable.value as number) += input[variableName] as number;
    updatedCount++;
  }
  return { updatedCount };
}

export const increaseVariableFunctionInformation : InternalMetaFunction = {
  functionName: "increaseVariables",
  version: "1.0.0",
  description: "Increases all the given variables by the given amount",
  inputParameters: {
    "${variableName}": { type: "number", required: true },
  },
  outputData: {
    updatedCount: { type: "number", required: false },
    errorMessage: { type: "string", required: false },
  },
};
