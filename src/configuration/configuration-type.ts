import { BusinessOperations } from "./business-operations/business-operations-type";
import { ProtocolConfigType } from "./protocols/protocols-type";
import { SchemaType } from "./schemas/schemas-type";

export interface ConfigurationType {
  name : string;
  version : string;
  protocols ?: ProtocolConfigType[];
  envs ?: EnvironmentVariable[];
  schemas : SchemaType[];
  businessOperations : BusinessOperations[];
}

export interface EnvironmentVariable {
  key : string;
  value : string;
}
