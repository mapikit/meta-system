import { ObjectDefinition } from "meta-function-helper";
import { ExtendedJsonTypes } from "../../common/types/json-types";
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

export type ExtendedJsonTypeDict<T = ExtendedJsonTypes | "any"> =
  T extends "string" ? string :
    T extends "number" ? number :
      T extends "boolean" ? boolean :
        T extends "date" ? Date :
          T extends "object" ? object :
            T extends "array" ? Array<unknown> :
              T extends "any" ? unknown : never;

export class BopsConstant {
  name : string;
  type : ExtendedJsonTypes | "any";
  value : ExtendedJsonTypeDict;
}

export interface BopsVariable {
  name : string;
  type : ExtendedJsonTypes | "any";
  initialValue ?: ExtendedJsonTypeDict;
}

export type ModuleType = "schemaFunction"
| "external"
| "internal"
| "bop"
| "output"
| "variable"
| "protocol";

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
