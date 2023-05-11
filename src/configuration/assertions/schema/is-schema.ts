import { isObjectDefinition } from "@meta-system/object-definition";
import { SchemaType } from "../../schemas/schemas-type.js";

/**
 * Tests if the input given is a schema
 * @param input
 */
// eslint-disable-next-line max-lines-per-function
export function isSchema (input : unknown) : asserts input is SchemaType {
  if (typeof input !== "object") {
    throw TypeError("Schema with wrong format found - Not an object");
  }

  const schemasRequiredKeys : Array<keyof SchemaType> = ["name", "format", "identifier"];
  const inputKeys = Object.keys(input);
  const hasAllRequiredKeys = schemasRequiredKeys.every((requiredKey) =>
    inputKeys.includes(requiredKey) && input[requiredKey] !== null,
  );

  if (!hasAllRequiredKeys) {
    const missingKeys = schemasRequiredKeys.filter(key => !inputKeys.includes(key) || input[key] === null);
    throw TypeError("Schemas must contain all keys " + schemasRequiredKeys.join(", ") +
    `\n\t(Missing ${missingKeys.join(", ")})`);
  }

  const schemaLikeInput = input as SchemaType;

  if (typeof schemaLikeInput.name !== "string") {
    throw TypeError("Schema name must be a string");
  }

  isObjectDefinition(schemaLikeInput.format);
};
