import { ObjectDefinition } from "@meta-system/object-definition";

export interface SchemaType {
  name : string;
  format : ObjectDefinition<SchemaDefinitionExtension>;
  dbProtocol : string;
  identifier : string;
}

export type SchemaDefinitionExtension = {
  refName ?: string;
};

export const schemaDefinitionExtensionKeyAndTypes = [
  { key: "refName", type: "string" },
];

