import { SchemasType } from "@api/configuration/schemas/schemas-type";
import { BusinessOperations } from "@api/configuration/business-operations/business-operations-type";
import { ProtocolConfigType } from "@api/configuration/protocols/protocol-config-type";

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
