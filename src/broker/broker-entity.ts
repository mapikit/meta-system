import { logger } from "../common/logger/logger.js";
import constants from "../common/constants.js";
import { EntityAction } from "../entities/entity-action.js";
import { EntityValue } from "../entities/meta-entity.js";
import { EntityRepository } from "../entities/repository.js";

export class BrokerEntityFactory<T extends EntityValue> {
  private result : BrokerEntity;
  private readonly steps : Array<Function> = [];
  private readonly allowedActions : Map<string, EntityAction<T, EntityRepository<T>>> = new Map();
  private readonly permissions : string[] = [];
  private repository : EntityRepository<T>;

  public withAction (action : EntityAction<T, EntityRepository<T>>) : this {
    const step = () : void => {
      if (!this.repository) {
        throw Error("Must call '.usingRepository()' before this!");
      }

      if (this.permissions.includes(action.permission)
      || this.permissions.includes(constants.PERMISSION_OVERRIDE_VALUE)) {
        this.result[action.name] = action.action(this.repository);
        this.allowedActions.set(action.name, action);
      }
    };

    this.steps.push(step);

    return this;
  }

  public withPermissions (perms : string[]) : this {
    this.steps.push(() => {
      this.permissions.push(...perms);
    });

    return this;
  }

  public usingRepository (repository : EntityRepository<T>) : this {
    if (!repository) {
      const error = "Can't build a broker without a repository!";
      logger.fatal(error);
      throw error;
    }

    this.steps.push(() => {
      this.repository = repository;
    });

    return this;
  }

  public build () : BrokerEntity {
    const intermediate = {
      done: () : void => {
        Object.keys(this.result).forEach((key) => {
          if (key === "done") return;
          if (this.allowedActions.get(key).callableInRuntime) return;

          delete this.result[key];
        });
      },
    };

    this.result = intermediate;
    this.steps.forEach((step) => step());

    return this.result;
  }
}

export type BrokerEntity = Record<string, Function> & {
  done() : void;
}
