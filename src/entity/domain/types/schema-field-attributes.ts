import { JsonTypes } from "@api/common/types/json-types";

export interface SchemaField {
  fieldName : string;
  fieldType : JsonTypes;
  nullable : boolean;
  readonly : boolean;
};
