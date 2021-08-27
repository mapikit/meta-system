import { isValidType } from "../../../../common/assertions/is-valid-type";
import { CloudedObject } from "common/types/clouded-object";
import { InternalMetaFunction } from "../../../internal-meta-function";
import { ResolvedVariables } from "../variables-context";

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
  inputParameters: {
    "${variableName}": { type: "any", required: true },
  },
  outputData: {
    newValue: { type: "any", required: false },
    errorMessage: { type: "string", required: false },
  },
};
