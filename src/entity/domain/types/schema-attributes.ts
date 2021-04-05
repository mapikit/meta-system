
import { SchemaField } from "@api/entity/domain/types/schema-field-attributes";
import { DatabaseEntity } from "@api/common/types/database-entity";

export interface SchemaAttributes extends DatabaseEntity {
  schemaId : string;
  name : string;
  collectionLocation : string;
  parentEntity : string;
  schema : SchemaField[];
  clientId : string;
};
