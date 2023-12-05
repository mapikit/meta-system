export type EntityType = "schema" | "schemaFunctions" | "internalFunctions" | "businessOperations" | "bopsFunctions"
| "envs" | "addonsFunctions";

export type ConfigurationDiff = {
  action : "added" | "modified" | "removed";
  actorIdentifier : string;
  targetEntityType : EntityType;
  targetEntityIdentifier :  string;
  targetPath : string;
  newEntityState : unknown;
  targetPathNewValue : unknown;
}

