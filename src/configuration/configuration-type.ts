import { Addon } from "./addon-type.js";
import { BusinessOperations } from "./business-operations/business-operations-type.js";
import { SchemaType } from "./schemas/schemas-type.js";

export interface ConfigurationType {
  name : string;
  version : string;
  envs ?: EnvironmentVariable[];
  schemas : SchemaType[];
  businessOperations : BusinessOperations[];
  addons : Addon[];
}

export interface EnvironmentVariable {
  key : string;
  value : string;
}
