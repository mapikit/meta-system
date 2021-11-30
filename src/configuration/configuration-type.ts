import { BusinessOperations } from "./business-operations/business-operations-type";
import { ProtocolConfigType } from "./protocols/protocols-type";
import { SchemasType } from "./schemas/schemas-type";

export interface ConfigurationType {
  name : string;
  version : string;
  protocols ?: ProtocolConfigType[];
  envs ?: EnvironmentVariable[];
  dbConnectionString : string;
  schemas : SchemasType[];
  businessOperations : BusinessOperations[];
}

export interface EnvironmentVariable {
  key : string;
  value : string;
}
