import { SchemasType } from "@api/configuration/schemas/schemas-type";
import { BusinessOperations } from "@api/configuration/business-operations/business-operations-type";

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
