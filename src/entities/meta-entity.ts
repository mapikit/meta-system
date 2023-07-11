import constants from "../common/constants.js";

export type EntityValue<T extends object = object> = T & {
  identifier : string
}

/** handles ownership */
export class MetaEntity<T extends EntityValue> {
  public readonly owner : symbol;
  public data : T;

  public constructor (owner : symbol | string, entity : T) {
    let usedOwner = typeof owner === "string" ? Symbol(owner) : owner;
    if (owner === constants.RUNTIME_ENGINE_IDENTIFIER) {
      usedOwner = constants.ENGINE_OWNER;
    }

    this.owner = usedOwner;
    this.data = entity;
  }
}
