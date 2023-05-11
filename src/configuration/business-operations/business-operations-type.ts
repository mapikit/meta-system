import { ObjectDefinition } from "@meta-system/object-definition";
import { ExtendedJsonTypes } from "../../common/types/json-types.js";

export interface BusinessOperations {
  ttl ?: number;
  name : string;
  input : ObjectDefinition;
  output : ObjectDefinition;
  constants : BopsConstant[];
  variables : BopsVariable[];
  configuration : BopsConfigurationEntry[];
  customObjects : BopsCustomObject[];
  identifier : string;
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

export type ModuleType =  "internal"
| "bop"
| "output"
| "variable"
| "addon";

export interface BopsConfigurationEntry {
  moduleType : ModuleType;
  moduleName : string;
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
