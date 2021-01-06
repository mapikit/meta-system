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
  data ?: "string" | "boolean" | "number" | "date" | "array" | Record<string, SchemaObject>;
  refName ?: string;
}

export type SchemaTypeDefinitionObject = {
  type : "object";
  data ?: Record<string, SchemaTypeDefinition>;
}

// const testObj : SchemasType = {
//   "name": "customer",
//   "format": {
//     "id": { "type": "string" },
//     "name": { "type": "string" },
//     "phone": { "type": "string" },
//     "email": { "type": "string" },
//     "purchases": { "type": "array", "data": "string", "refName": "purchase" },
//     "birthdate": { "type": "date" },
//     "address": { "type": "object", "data": {
//       "street": { "type": "string" },
//       "city": { "type": "string" },
//       "number": { "type": "string" },
//     } },
//   },
//   "routes": {
//     "getMethodEnabled": true,
//     "postMethodEnabled": true,
//     "deleteMethodEnabled": false,
//     "patchMethodEnabled": true,
//     "putMethodEnabled": false,
//     "queryParamsGetEnabled": true,
//   },
// };
