import { ObjectDefinition, TypeDefinition } from "@meta-system/object-definition";
import { TypeDefinitionDeep } from "@meta-system/object-definition/dist/object-definition-type.js";
import { SchemaDefinitionExtension, SchemaType } from "./schemas-type.js";

const getRef = (typeDefinition : TypeDefinition<SchemaDefinitionExtension>) : string[] => {
  if (typeDefinition.type === "object") {
    return Schema.findRefs((typeDefinition as TypeDefinitionDeep).subtype as ObjectDefinition);
  }

  if (typeDefinition.refName !== undefined) {
    return [typeDefinition.refName];
  }

  return [];
};

export class Schema implements SchemaType {
  public readonly name : string;
  public readonly identifier : string;
  public readonly format : ObjectDefinition<SchemaDefinitionExtension>;

  public constructor (schema : SchemaType) {
    this.name = schema.name;
    this.format = schema.format;
    this.identifier = schema.identifier;
  }

  static findRefs (format : ObjectDefinition<SchemaDefinitionExtension>) : string[]  {
    const values = Object.values(format);
    const results = [];

    values.forEach((typeDefinition) => {
      results.push(...getRef(typeDefinition));
    });

    return results;
  }
}
