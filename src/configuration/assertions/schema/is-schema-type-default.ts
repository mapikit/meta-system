import { SchemaTypeDefinitionParameter } from "../../schemas/schemas-type";

export function isSchemaTypeDefault (input : object) : asserts input is SchemaTypeDefinitionParameter {
  const schemaProperty = input as SchemaTypeDefinitionParameter;

  if (schemaProperty.refName !== undefined) {
    if (schemaProperty.type !== "string") {
      throw new TypeError("Schema with incorrect format found: 'Properties with refname must be type string'");
    }

    if (typeof schemaProperty.refName !== "string") {
      throw new TypeError("Schema with incorrect format found: 'refName is expected to be a string'");
    }
  }
};
