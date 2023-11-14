export type ConfigurationDiff = {
  action : "added" | "modified" | "removed";
  actor : string;
  target : {
    entity : "schema" | "schemaFunctions" | "internalFunctions" | "businessOperations" | "bopsFunctions" | "envs";
    identifier : string;
    path : string; // A path using dot.notation for where the change happened
  }
  finalValue : unknown;
}

