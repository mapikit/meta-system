import { SchemaFunctions } from "@api/schemas/application/schema-bops-functions";

export function main (input : { entityId : string }) : unknown {
  return SchemaFunctions.getById(input);
}
