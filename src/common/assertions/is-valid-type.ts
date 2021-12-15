import { ObjectDefinition } from "@meta-system/meta-function-helper";

export function isValidType (value : unknown, typeName : string, typeDef ?: ObjectDefinition) : boolean {
  if(ComplexTypes[typeName] === undefined) {
    return typeof value === typeName;
  };
  return validateComplexType[typeName](value, typeDef);
};

enum ComplexTypes  {
  object = "object",
  array = "array",
  any = "any"
}

type ValidatorType = {
  [expectedType in ComplexTypes] : (value : unknown, typeDef ?: ObjectDefinition) => boolean;
}

const validateComplexType : ValidatorType = {
  "object" : (value, typeDef) => {
    if(typeDef) console.log("TypeDef validation has not been implemented yet");
    if(typeof value === "object" && !Array.isArray(value)) return true;
    return false;
  },
  "array" : (value, typeDef) => {
    if(typeDef) console.log("TypeDef validation has not been implemented yet");
    if(Array.isArray(value)) return true;
    return false;
  },
  "any" : () => true,
};
