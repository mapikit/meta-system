
import { TypeDefinitionDeep } from "@meta-system/object-definition/dist/src/object-definition-type";
import { SchemaDefinitionExtension } from "../../../configuration/schemas/schemas-type";
import { isSchemaFormat } from "./is-schema-format";

// eslint-disable-next-line max-lines-per-function
export function isSchemaTypeArray (input : object) : asserts input is TypeDefinitionDeep & SchemaDefinitionExtension {
  const schemaTypeDefinition = input as TypeDefinitionDeep & SchemaDefinitionExtension;

  if (schemaTypeDefinition.subtype === undefined) {
    throw TypeError("Schema with incorrect format found: 'subtype is not defined for Array type'");
  }

  if (schemaTypeDefinition.refName !== undefined) {
    if (schemaTypeDefinition.subtype !== "string") {
      throw new TypeError("Schema with incorrect format found: 'subtype must be \"string\" with a refName defined'");
    }

    if (typeof schemaTypeDefinition.refName !== "string") {
      throw new TypeError("Schema with incorrect format found: 'refName is expected to be a string'");
    }
  }

  if (typeof schemaTypeDefinition.subtype === "object") {
    isSchemaFormat(schemaTypeDefinition.subtype);
  }
};
