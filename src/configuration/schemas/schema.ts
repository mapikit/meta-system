import { ObjectDefinition } from "@meta-system/object-definition";
import { SchemaType } from "./schemas-type.js";

export class Schema implements SchemaType {
  public readonly name : string;
  public readonly identifier : string;
  public readonly format : ObjectDefinition;

  public constructor (schema : SchemaType) {
    this.name = schema.name;
    this.format = schema.format;
    this.identifier = schema.identifier;
  }
}
