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
  localization : "uri" | "body";
}

export interface BopsOutput {
  name : string;
  type : string;
  statusCode : number;
}

export interface BopsConstant {
  name : string;
  type : JsonTypes;
}

export interface BopsConfigurationEntry {
  moduleRepo : string;
  key : number;
  inputsSource : InputsSource[];
  nextFunctions ?: NextFunctions[];
}

export interface InputsSource {
  source : string | number;
  target : string;
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
