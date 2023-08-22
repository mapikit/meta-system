import { ObjectDefinition } from "@meta-system/object-definition";

export interface SchemaType {
  name : string;
  format : ObjectDefinition;
  identifier : string;
}
