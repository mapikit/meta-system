import { isValidType } from "../../../../common/assertions/is-valid-type.js";
import { CloudedObject } from "../../../../common/types/clouded-object.js";
import { InternalMetaFunction } from "../../../internal-meta-function.js";
import { ResolvedVariables } from "../variables-context.js";

export function setVariablesFunction (input : CloudedObject, variables : ResolvedVariables) : unknown {
  let setCount = 0;
  for(const variableName of Object.keys(input)) {
    const foundVariable = variables[variableName];

    if(foundVariable === undefined) {
      return { errorMessage: `No variable named "${variableName}" was found` };
    }

    if(!isValidType(input[variableName], foundVariable.type)) {
      return { errorMessage: `Type "${typeof input[variableName]}" is not compatible with "${foundVariable.type}"` };
    }

    foundVariable.value = input[variableName];
    setCount ++;
  }

  return { setCount };
}

export const setVariablesFunctionInformation : InternalMetaFunction = {
  functionName: "setVariables",
  version: "1.0.0",
  description: "Sets the variables in targetPath to the new value",
  input: {
    "%variableName": { type: "any", required: true },
  },
  output: {
    newValue: { type: "any", required: false },
    errorMessage: { type: "string", required: false },
  },
};
