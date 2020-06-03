import { IsNotEmpty } from "class-validator";
import { MapikitRequest } from "@api/common/types/mapikit-request";
import { SchemaAttributes } from "@api/entity/domain/types/schema-attributes";

export class ContextCreationRequest extends MapikitRequest {
  @IsNotEmpty()
  public clientSchemas : SchemaAttributes[];
}
