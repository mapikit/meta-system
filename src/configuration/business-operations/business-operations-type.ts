import { ObjectDefinition } from "meta-function-helper";
import { JsonTypes } from "../../common/types/json-types";
import { ProtocolConfigType } from "../protocols/protocol-config-type";

export interface BusinessOperations {
  name : string;
  input : ObjectDefinition;
  output : ObjectDefinition;
  constants : BopsConstant[];
  variables : BopsVariable[];
  configuration : BopsConfigurationEntry[];
  customObjects : BopsCustomObject[];
  protocols ?: ProtocolConfigType[];
}

export type JsonTypeDict<T = JsonTypes> =
  T extends "string" ? string :
    T extends "number" ? number :
      T extends "boolean" ? boolean :
        T extends "date" ? Date : never;

export class BopsConstant {
  name : string;
  type : JsonTypes;
  value : JsonTypeDict<JsonTypes>;
}

export interface BopsVariable {
  name : string;
  type : JsonTypes;
  initialValue ?: JsonTypeDict<JsonTypes>;
}

export type ModuleType = "schemaFunction"
| "external"
| "internal"
| "bop"
| "output"
| "variable";

export interface BopsConfigurationEntry {
  version ?: string;
  moduleType : ModuleType;
  moduleRepo : string;
  modulePackage ?: string;
  key : number;
  dependencies : Dependency[];
}

export interface Dependency {
  origin : string | number;
  targetPath ?: string;
  originPath ?: string;
}

export interface BopsCustomObject {
  name : string;
  properties : ObjectDefinition;
}
