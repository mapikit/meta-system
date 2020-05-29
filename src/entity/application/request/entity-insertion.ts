import { IsNotEmpty, IsUUID } from "class-validator";
import { MapikitRequest } from "@api/common/types/mapikit-request";
import { Entity } from "@api/entity/domain/models/entity";

export class EntityInsertionRequest extends MapikitRequest {
  @IsNotEmpty()
  public readonly entity : Entity;

  @IsNotEmpty()
  @IsUUID()
  public readonly schemaId : string;
}
