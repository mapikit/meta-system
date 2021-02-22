import { SchemaFunctions } from "@api/schemas/application/schema-bops-functions";

export function main (input : Record<string, unknown>) : unknown {
  return SchemaFunctions.create(input);
}
