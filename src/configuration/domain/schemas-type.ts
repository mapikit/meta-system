export interface SchemasType {
  name : string;
  format : SchemaObject;
  routes : {
    getMethodEnabled : boolean;
    postMethodEnabled : boolean;
    deleteMethodEnabled : boolean;
    patchMethodEnabled : boolean;
    putMethodEnabled : boolean;
    queryParamsGetEnabled : boolean;
  };
}

export type SchemaObject = {
  [K in string] : SchemaTypeDefinition;
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
