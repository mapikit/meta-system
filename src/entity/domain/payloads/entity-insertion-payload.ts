import { Entity } from "@api/entity/domain/models/entity";
import { SchemaAttributes } from "@api/entity/domain/types/schema-attributes";

export interface EntityInsertionPayload {
  readonly schema : SchemaAttributes;
  readonly entity : Entity;
}
