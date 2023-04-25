import type { EntityRepository } from "../repository.js";
import { EntityValue, MetaEntity } from "../meta-entity.js";
import { EntityAction } from "../../entities/entity-action.js";

type AddonEntityValue = EntityValue & {
  name : string;
  version : string;
  configuration : string;
  metaFile : unknown;
};

export const loggerSingleton : Array<MetaEntity<AddonEntityValue>> = [];

type AddonRepositoryType = EntityRepository<AddonEntityValue>;

// Actions ---------------------------

const installAddon = new EntityAction<AddonEntityValue, AddonRepositoryType>(
  "install",
  "installAddon",
  (repo) => (addonData : unknown) : void => {
    // Do stuff here in the future
  },
  false,
);

export const addonActions = [
  installAddon,
];
