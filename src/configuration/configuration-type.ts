import { CloudedObject } from "common/types/clouded-object";
import { BusinessOperations } from "./business-operations/business-operations-type";
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

export interface ProtocolConfigType {
  protocolType : string;
  protocolVersion : string; // SemVer;
  configuration : CloudedObject;
}

export interface EnvironmentVariable {
  key : string;
  value : string;
}
