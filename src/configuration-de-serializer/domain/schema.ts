import { SchemaObject, SchemasType, SchemaTypeDefinition } from "./schemas-type";

const getRef = (typeDefinition : SchemaTypeDefinition) : string[] => {
  if (typeDefinition.type === "object") {
    return Schema.findRefs(typeDefinition.data);
  }

  if (typeDefinition.refName !== undefined) {
    return [typeDefinition.refName];
  }

  return [];
};

export class Schema implements SchemasType {
  public readonly name : string;
  public readonly routes : {
    getMethodEnabled : boolean;
    postMethodEnabled : boolean;
    deleteMethodEnabled : boolean;
    patchMethodEnabled : boolean;
    putMethodEnabled : boolean;
    queryParamsGetEnabled : boolean;
  };

  public readonly format : SchemaObject;

  public constructor (schema : SchemasType) {
    this.name = schema.name;
    this.routes = schema.routes;
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
