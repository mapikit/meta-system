import { ObjectDefinition } from "@meta-system/object-definition";

export interface SchemaType {
  name : string;
  format : SchemaObject;
  dbProtocol : string;
  identifier : string;
}

export type SchemaObject = {
  [K in string] : ObjectDefinition;
}

export type SchemaTypeDefinition = SchemaTypeDefinitionParameter
| SchemaTypeDefinitionArray
| SchemaTypeDefinitionObject;

export type SchemaTypeDefinitionParameter = {
  type : "string" | "boolean" | "number" | "date";
  required ?: boolean;
  refName ?: string;
}

export type SchemaTypeDefinitionArray = {
  type : "array";
  subtype : "string" | "boolean" | "number" | "date" | Record<string, SchemaTypeDefinition>;
  required ?: boolean;
  refName ?: string;
}

export type SchemaTypeDefinitionObject = {
  type : "object";
  required ?: boolean;
  subtype : SchemaObject;
}
