import { SchemaFunctions } from "@api/schemas/application/schema-bops-functions";

export async function main (input : { query : Record<string, unknown> }) : Promise<unknown> {
  return SchemaFunctions.get(input);
}
