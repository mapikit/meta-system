import { Entity } from "@api/entity/domain/models/entity";

export interface EntityInsertionPayload {
  readonly schemaId : string;
  readonly entity : Entity;
}
