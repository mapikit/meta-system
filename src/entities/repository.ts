import clone from "just-clone";
import { EntityValue, MetaEntity } from "./meta-entity.js";

export class EntityRepository<T extends EntityValue> {
  public constructor (
    private collectionSingleton : Array<MetaEntity<T>>,
  ) {}

  public createEntity (entity : MetaEntity<T>) : void {
    this.collectionSingleton.push(entity);
  }

  public updateEntity (entity : MetaEntity<T>) : void {
    const itemIndex = this.collectionSingleton.findIndex((ent) => {
      ent.data.identifier === entity.data.identifier;
    });

    if (itemIndex === -1) { return; }

    this.collectionSingleton[itemIndex] = entity;
  }

  public readCollection () : Array<MetaEntity<T>> {
    return this.collectionSingleton.map((value) => {
      return new MetaEntity(value.owner, clone(value.data));
    });
  }

  public deleteEntity (entity : MetaEntity<T>) : void {
    this.collectionSingleton.filter((ent) => {
      ent.data.identifier !== entity.data.identifier;
    });
  }

  public getEntity (identifier : string) : MetaEntity<T> {
    return this.readCollection().find((ent) => ent.data.identifier === identifier);
  }
}
