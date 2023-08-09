import { ObjectDefinition, validateObject } from "@meta-system/object-definition";
import { logger } from "../../common/logger/logger.js";

const definitionTypeDef = {
  functionName : { type: "string", required: true },
  description: { type: "string", required: false },
  input: { type: "cloudedObject", required: true },
  output: { type: "cloudedObject", required: true },
};

export function validateDefinition (definition : unknown, identifier : string)
  : asserts definition is ObjectDefinition {
  logger.info(`Validating definition for "${identifier}"`);
  const validationResult = validateObject(definition, definitionTypeDef);
  if(validationResult.errors.length > 0) {
    throw Error(`"${identifier}" Does not have a valid definition:\n` +
      validationResult.errors.map(error => `${error.path} :: ${error.error}`).join("\n"),
    );
  }
}
