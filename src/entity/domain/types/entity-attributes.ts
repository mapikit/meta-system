import { DatabaseEntity } from "@api/common/types/database-entity";

export interface EntityAttributes extends DatabaseEntity {
  [FieldName : string] : any;
};
