import { SchemaFunctions } from "@api/schemas/application/schema-bops-functions";

export async function main (input : { id : string }) : Promise<unknown> {
  return SchemaFunctions.deleteById(input.id);
}
