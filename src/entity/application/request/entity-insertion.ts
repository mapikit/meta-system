import { IsNotEmpty, IsUUID } from "class-validator";
import { MapikitRequest } from "@api/common/types/mapikit-request";
import { Entity } from "@api/entity/domain/models/entity";
import { SchemaAttributes } from "@api/entity/domain/types/schema-attributes";

export class EntityInsertionRequest extends MapikitRequest {
  @IsNotEmpty()
  @IsUUID()
  public schema : SchemaAttributes;

  @IsNotEmpty()
  public entity : Entity;
}
