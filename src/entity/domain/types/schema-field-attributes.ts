import { JsonType } from "@api/common/types/json-types";

export interface SchemaField {
  fieldName : string;
  fieldType : JsonType;
  nullable : boolean;
  readonly : boolean;
};
