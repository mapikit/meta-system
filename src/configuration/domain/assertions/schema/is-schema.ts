import { SchemasType } from "@api/configuration/domain/schemas-type";
import { isSchemaRoutesConfiguration } from
  "@api/configuration/domain/assertions/schema/is-schema-routes-configuration";
import { isSchemaFormat } from "./is-schema-format";

/**
 * Tests if the input given is a schema
 * @param input
 */
// eslint-disable-next-line max-lines-per-function
export function isSchema (input : unknown) : asserts input is SchemasType {
  if (typeof input !== "object") {
    throw this.defaultError;
  }

  const schemasRequiredKeys : Array<keyof SchemasType> = ["name", "format", "routes"];
  const inputKeys = Object.keys(input);
  const hasAllRequiredKeys = schemasRequiredKeys.some((requiredKey) =>
    inputKeys.includes(requiredKey),
  );

  if (!hasAllRequiredKeys) {
    throw this.defaultError;
  }

  const schemaLikeInput = input as SchemasType;

  if (typeof schemaLikeInput.name !== "string") {
    throw this.defaultError;
  }

  isSchemaRoutesConfiguration(schemaLikeInput.routes);
  isSchemaFormat(schemaLikeInput.format);
};
