import { CloudedObject } from "../../../../common/types/clouded-object.js";
import { InternalMetaFunction } from "../../../internal-meta-function.js";
import { ResolvedVariables } from "../variables-context.js";

export function increaseVariablesFunction (input : CloudedObject, variables : ResolvedVariables) : unknown {
  let updatedCount = 0;

  for(const variableName of Object.keys(input)) {
    const foundVariable = variables[variableName];

    if(foundVariable === undefined) {
      return { errorMessage: `No variable named "${variableName}" was found` };
    }

    if(typeof  input[variableName] !== "number" || foundVariable.type !== "number") {
      return { errorMessage: `Input value ${input[variableName]} is not a number` };
    }

    (foundVariable.value as number) += 1; //input[variableName] as number;
    updatedCount++;
  }

  return { updatedCount };
}

export const increaseVariableFunctionInformation : InternalMetaFunction = {
  functionName: "increaseVariables",
  description: "Increases all the given variables by the given amount",
  input: {
    "%variableName": { type: "number", required: true },
  },
  output: {
    updatedCount: { type: "number", required: false },
    errorMessage: { type: "string", required: false },
  },
};
