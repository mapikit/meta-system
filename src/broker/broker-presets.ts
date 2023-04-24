import { EntityValue } from "entities/meta-entity.js";
import { EntityAction } from "../entities/entity-action.js";
import { EntityRepository } from "../entities/repository.js";
import { loggerActions, loggerSingleton } from "../entities/singletons/logger.js";

type PresetType = {
  repo : EntityRepository<EntityValue>,
  actions : EntityAction<EntityValue, EntityRepository<EntityValue>>[]
}

export const brokerPresets : Record<string, PresetType> = {
  "logger": {
    repo: new EntityRepository(loggerSingleton),
    actions: loggerActions,
  },
};
