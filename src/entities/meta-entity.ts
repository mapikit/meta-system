export type EntityValue<T extends object = object> = T & {
  identifier : string
}

/** handles ownership */
export class MetaEntity<T extends EntityValue> {
  public readonly owner : symbol;
  public data : T;

  public constructor (owner : symbol | string, entity : T) {
    this.owner = typeof owner === "string" ? Symbol(owner) : owner;
    this.data = entity;
  }
}
