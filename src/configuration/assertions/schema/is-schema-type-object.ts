import { isObjectDefinition } from "@meta-system/object-definition";
import { TypeDefinitionDeep } from "@meta-system/object-definition/dist/src/object-definition-type";
import { SchemaDefinitionExtension } from "configuration/schemas/schemas-type";
import { logger } from "../../../common/logger/logger";

export function isSchemaTypeObject (input : unknown) : asserts input is TypeDefinitionDeep & SchemaDefinitionExtension {
  if (input["subtype"] === undefined) {
    throw TypeError("Schema with incorrect format found: 'subtype is not defined for Object type'");
  }

  if (input["refName"] !== undefined) {
    logger.warn("Warning - Ignoring refName field for Schema property with type Object");
  }

  isObjectDefinition((input as object)["subtype"]);
};
