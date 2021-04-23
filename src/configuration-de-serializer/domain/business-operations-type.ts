import { JsonTypes } from "@api/common/types/json-types";

export interface BusinessOperations {
  name : string;
  inputs : BopsInput[];
  outputs : BopsOutput[];
  route ?: string;
  constants : BopsConstant[];
  configuration : BopsConfigurationEntry[];
  usedAsRoute : boolean;
  customObjects : BopsCustomObject[];
}

export interface BopsInput {
  name : string;
  type : string;
  localization ?: "uri" | "body";
}

export interface BopsOutput {
  name : string;
  type : string;
  statusCode : number;
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
  inputsSource : InputsSource[];
  nextFunctions ?: NextFunctions[];
}

export interface InputsSource {
  source : string | number;
  target : string;
  sourceOutput ?: string;
}

export interface NextFunctions {
  nextKey : number;
  branch ?: string;
}

export interface BopsCustomObject {
  name : string;
  properties : BopsCustomObjectProperty[];
}

export interface BopsCustomObjectProperty {
  name : string;
  type : string;
}
