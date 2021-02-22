import { SchemaFunctions } from "@api/schemas/application/schema-bops-functions";

export function main (input : { id : string }) : unknown {
  return SchemaFunctions.deleteById(input.id);
}
