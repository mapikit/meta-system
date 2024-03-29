import { EntityRepository } from "../entities/repository.js";
import { BrokerEntity, BrokerEntityFactory } from "./broker-entity.js";
import { brokerPresets } from "./broker-presets.js";
import { EntityValue } from "../entities/meta-entity.js";
import { EntityAction } from "entities/entity-action.js";

export interface EntityPermissions { entity : string, permissions : string[] };

export class BrokerFactory {
  private result : EntityBroker;
  private brokerEntitiesAndActions = { ...brokerPresets };
  private readonly steps : Array<Function> = [];

  public configEntity <T extends EntityValue> (
    entityName : string,
    actions : EntityAction<EntityValue, EntityRepository<EntityValue>>[],
    repo ?: EntityRepository<T>) : this {
    this.steps.push(() => {
      this.brokerEntitiesAndActions[entityName] = { repo, actions };
    });

    return this;
  }

  public useEntity <T extends EntityValue>
  (data : { entity : string, permissions : string[] }, repo ?: EntityRepository<T>) : this {
    this.steps.push(() => {
      const foundPreset = this.brokerEntitiesAndActions[data.entity];
      if (!foundPreset) { return; }

      const factory = new BrokerEntityFactory();
      factory.usingRepository(foundPreset.repo ?? repo);
      factory.withPermissions(data.permissions);

      foundPreset.actions.forEach((action) => {
        factory.withAction(action);
      });

      this.result[data.entity] = factory.build();
    });

    return this;
  }

  public build () : EntityBroker {
    const intermediate = {
      done: () : void => {
        Object.keys(this.result).forEach((key) => {
          if (key === "done") return;
          this.result[key].done();
        });
      },
    };

    this.result = intermediate as EntityBroker;
    // Always add logger
    this.useEntity({ entity: "logger", permissions: ["log"] });

    this.steps.forEach((step) => step());

    return this.result;
  }

  public static joinBrokers (...brokers : EntityBroker[]) : EntityBroker {
    const result : EntityBroker = {} as unknown as EntityBroker;
    for (const broker of brokers) {
      Object.assign(result, broker);
    }

    result.done = () : void => {
      Object.keys(result).forEach((key) => {
        if (key === "done") return;
        result[key].done();
      });
    };

    return result;
  }

  public static wrapBrokerDone (broker : EntityBroker, wrapper : Function) : EntityBroker {
    const doneFunction = broker.done;
    broker.done = () : void => {
      wrapper();
      doneFunction();
    };

    return broker;
  }
}

export type EntityBroker = Record<string, BrokerEntity> & {
  done : () => void;
}
