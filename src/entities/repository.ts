// eslint-disable-next-line max-classes-per-file
import clone from "just-clone";
import { EntityValue, MetaEntity } from "./meta-entity.js";

export class RepositoryError extends Error {}

export class EntityRepository<T extends EntityValue> {
  public constructor (
    private collectionSingleton : Array<MetaEntity<T>>,
  ) {}

  public createEntity (entity : MetaEntity<T>) : void {
    const identifier = entity.data.identifier;
    if (this.getEntity(identifier)) {
      throw new RepositoryError(`Cannot create entity: Identifier "${identifier}" already exists.`);
    }

    this.collectionSingleton.push(entity);
  }

  public updateEntity (entity : MetaEntity<T>) : void {
    const itemIndex = this.collectionSingleton.findIndex((ent) => {
      return ent.data.identifier === entity.data.identifier;
    });

    if (itemIndex === -1) {
      throw new RepositoryError(`Cannot update entity: Identifier "${entity.data.identifier}" does not exist.`);
    }

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
