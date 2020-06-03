import { EntityAttributes } from "@api/entity/domain/types/entity-attributes";
import { Entity } from "@api/entity/domain/models/entity";

export interface MongoRepositoryAttributes {
  initialize () : Promise<this>;
  initializeInDb (databaseName : string) : Promise<void>;
  createDatabase (databaseName : string) : Promise<void>;
  checkoutDatabase (databaseName : string) : Promise<void>;
  createCollection (collectionName : string) : Promise<void>;
  selectCollection (collectionName : string) : Promise<void>;
  dropCollection (collectionName : string) : Promise<void>;
  query (queryTerm : Partial<Entity>) : Promise<Entity[]>;
  getEntities () : Promise<EntityAttributes[]>;
  insert (entity : Entity) : Promise<void>;
  close () : Promise<void>;
};
