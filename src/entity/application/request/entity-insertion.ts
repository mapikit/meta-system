import { IsNotEmpty, IsUUID } from "class-validator";
import { MapikitRequest } from "@api/common/types/mapikit-request";
import { Entity } from "@api/entity/domain/models/entity";

export class EntityInsertionRequest extends MapikitRequest {
  @IsNotEmpty()
  @IsUUID()
  public schemaId : string;

  @IsNotEmpty()
  public entity : Entity;
}
