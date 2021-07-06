import { SchemaTypeDefinitionObject } from "../../schemas/schemas-type";
import { isSchemaFormat } from "./is-schema-format";

export function isSchemaTypeObject (input : unknown) : asserts input is SchemaTypeDefinitionObject {
  const schemaTypeDefinition = input as SchemaTypeDefinitionObject;

  if (schemaTypeDefinition.subtype === undefined) {
    throw TypeError("Schema with incorrect format found: 'subtype is not defined for Object type'");
  }

  if (schemaTypeDefinition["refName"] !== undefined) {
    console.warn("Warning - Ignoring refName field for Schema property with type Object");
  }

  isSchemaFormat(schemaTypeDefinition.subtype);
};
