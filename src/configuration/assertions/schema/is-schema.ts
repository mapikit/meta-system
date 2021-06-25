import { SchemasType } from "@api/configuration/schemas/schemas-type";
import { isSchemaFormat } from "./is-schema-format";

/**
 * Tests if the input given is a schema
 * @param input
 */
// eslint-disable-next-line max-lines-per-function
export function isSchema (input : unknown) : asserts input is SchemasType {
  if (typeof input !== "object") {
    throw TypeError("Schema with wrong format found - Not an object");
  }

  const schemasRequiredKeys : Array<keyof SchemasType> = ["name", "format"];
  const inputKeys = Object.keys(input);
  const hasAllRequiredKeys = schemasRequiredKeys.some((requiredKey) =>
    inputKeys.includes(requiredKey),
  );

  if (!hasAllRequiredKeys) {
    throw TypeError("Schemas must contain both keys \"name\" and \"format\"");
  }

  const schemaLikeInput = input as SchemasType;

  if (typeof schemaLikeInput.name !== "string") {
    throw TypeError("Schema name must be a string");
  }

  isSchemaFormat(schemaLikeInput.format);
};
