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
  refName ?: string;
}

export type SchemaTypeDefinitionArray = {
  type : "array";
  data : "string" | "boolean" | "number" | "date" | SchemaObject;
  refName ?: string;
}

export type SchemaTypeDefinitionObject = {
  type : "object";
  data : Record<string, SchemaTypeDefinition>;
}
