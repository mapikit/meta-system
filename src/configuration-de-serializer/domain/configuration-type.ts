import { BusinessOperations } from "./business-operations-type";
import { SchemasType } from "./schemas-type";

export interface ConfigurationType {
  name : string;
  version : string;
  port : number;
  envs : EnvironmentVariable[];
  dbConnectionString : string;
  schemas : SchemasType[];
  businessOperations : BusinessOperations[];
}

export interface EnvironmentVariable {
  key : string;
  value : string;
}
