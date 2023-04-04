import { BusinessOperations } from "./business-operations/business-operations-type.js";
import { ProtocolConfigType } from "./protocols/protocols-type.js";
import { SchemaType } from "./schemas/schemas-type.js";

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
