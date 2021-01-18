import { SchemaTypeDefinitionObject } from "@api/configuration-de-serializer/domain/schemas-type";
import { isSchemaFormat } from "@api/configuration-de-serializer/domain/assertions/schema/is-schema-format";

export function isSchemaTypeObject (input : unknown) : asserts input is SchemaTypeDefinitionObject {
  const schemaTypeDefinition = input as SchemaTypeDefinitionObject;

  if (schemaTypeDefinition.data === undefined) {
    throw TypeError("Schema with incorrect format found: 'Data is not defined for Object type'");
  }

  if (schemaTypeDefinition["refName"] !== undefined) {
    console.warn("Warning - Ignoring refName field for Schema property with type Object");
  }

  isSchemaFormat(schemaTypeDefinition.data);
};
