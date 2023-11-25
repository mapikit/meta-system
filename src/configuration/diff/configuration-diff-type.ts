export type ConfigurationDiff = {
  action : "added" | "modified" | "removed";
  actorIdentifier : string;
  targetEntityType : "schema" | "schemaFunctions" | "internalFunctions" | "businessOperations" | "bopsFunctions"
  | "envs" | "addonsFunctions";
  targetEntityIdentifier :  string;
  targetPath : string;
  newEntityState : unknown;
  targetPathNewValue : unknown;
}

