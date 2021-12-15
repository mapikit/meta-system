import { SchemaObject, SchemaType, SchemaTypeDefinition } from "./schemas-type";

const getRef = (typeDefinition : SchemaTypeDefinition) : string[] => {
  if (typeDefinition.type === "object") {
    return Schema.findRefs(typeDefinition.subtype);
  }

  if (typeDefinition.refName !== undefined) {
    return [typeDefinition.refName];
  }

  return [];
};

export class Schema implements SchemaType {
  public readonly name : string;

  public readonly format : SchemaObject;

  public constructor (schema : SchemaType) {
    this.name = schema.name;
    this.format = schema.format;
  }

  static findRefs (format : SchemaObject) : string[]  {
    const values = Object.values(format);
    const results = [];

    values.forEach((typeDefinition) => {
      results.push(...getRef(typeDefinition));
    });

    return results;
  }
}
