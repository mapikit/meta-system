import { CloudedObject } from "@api/common/types/clouded-object";
import { SchemaFunctions } from "@api/schemas/application/schema-bops-functions";

export async function main (input : { id : string; valuesToUpdate : CloudedObject }) : Promise<unknown> {
  return SchemaFunctions.updateById(input);
}
