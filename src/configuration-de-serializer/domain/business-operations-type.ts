import { JsonTypes } from "@api/common/types/json-types";
import { ObjectDefinition } from "meta-function-helper";

export interface BusinessOperations {
  name : string;
  input : ObjectDefinition;
  output : ObjectDefinition;
  constants : BopsConstant[];
  configuration : BopsConfigurationEntry[];
  customObjects : BopsCustomObject[];
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

export interface BopsConfigurationEntry {
  version ?: string;
  moduleRepo : string;
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
