import { ObjectDefinition, TypeDefinition } from "@meta-system/object-definition";
import { TypeDefinitionDeep } from "@meta-system/object-definition/dist/src/object-definition-type";
import { SchemaDefinitionExtension, SchemaType } from "./schemas-type";

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
  public readonly dbProtocol : string;
  public readonly identifier : string;
  public readonly format : ObjectDefinition<SchemaDefinitionExtension>;

  public constructor (schema : SchemaType) {
    this.name = schema.name;
    this.format = schema.format;
    this.dbProtocol = schema.dbProtocol;
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
