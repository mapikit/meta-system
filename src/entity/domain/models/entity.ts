import { EntityAttributes } from "@api/entity/domain/types/entity-attributes";

export class Entity implements EntityAttributes {
  public createdAt : Date;
  public updatedAt : Date;
  [FieldName : string] : any;

  public constructor (properties : EntityAttributes) {
    Object.assign(this, properties);
    this.createdAt = properties.createdAt;
    this.updatedAt = properties.updatedAt;
  }

  public static toDomain (input : Partial<EntityAttributes>) : Entity {
    const now = new Date();
    return new Entity({
      ...input,
      createdAt: input.createdAt || now,
      updatedAt: input.updatedAt || now,
    });
  }
}
