import { EntityValue } from "./meta-entity.js";
import { EntityRepository } from "./repository.js";

export class EntityAction<A extends EntityValue,T extends EntityRepository<A>> {
  // eslint-disable-next-line max-params
  public constructor (
    public readonly permission : string,
    public readonly name : string,
    public action : (repo : T) => Function,
    public readonly callableInRuntime : boolean = false,
  ) {}
}
