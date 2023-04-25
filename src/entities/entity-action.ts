import { ObjectDefinition } from "@meta-system/object-definition";
import { EntityValue } from "./meta-entity.js";
import { EntityRepository } from "./repository.js";

export class EntityAction<A extends EntityValue,T extends EntityRepository<A>> {
  public interface : { input : ObjectDefinition, output : ObjectDefinition };

  // eslint-disable-next-line max-params
  public constructor (
    public readonly permission : string,
    public readonly name : string,
    public action : (repo : T) => Function,
    public readonly callableInRuntime : boolean = false,
  ) {}

  public withInterface (input : ObjectDefinition, output : ObjectDefinition) : void {
    this.interface = {
      input, output,
    };
  }
}
