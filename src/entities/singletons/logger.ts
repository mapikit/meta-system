import type { EntityRepository } from "../repository.js";
import constants from "../../common/constants.js";
import { logger } from "../../common/logger/logger.js";
import { MetaEntity } from "../meta-entity.js";
import { EntityAction } from "entities/entity-action.js";

const loggerMetaEntity = new MetaEntity(constants.ENGINE_OWNER, { identifier: "default-logger", ...logger });
export const loggerSingleton = [loggerMetaEntity];

type LoggerRepositoryType = EntityRepository<typeof loggerMetaEntity["data"]>;

// Actions ---------------------------

const infoLogAction = new EntityAction<typeof loggerMetaEntity["data"], LoggerRepositoryType>(
  "log",
  "info",
  (repo) => (...data : unknown[]) : void => {
    repo.readCollection()[0].data.info(...data);
  },
  true,
);

const debugLogAction = new EntityAction<typeof loggerMetaEntity["data"], LoggerRepositoryType>(
  "log",
  "debug",
  (repo) => (...data : unknown[]) : void => {
    repo.readCollection()[0].data.debug(...data);
  },
  true,
);

const errorLogAction = new EntityAction<typeof loggerMetaEntity["data"], LoggerRepositoryType>(
  "log",
  "error",
  (repo) => (...data : unknown[]) : void => {
    repo.readCollection()[0].data.error(...data);
  },
  true,
);

const warnLogAction = new EntityAction<typeof loggerMetaEntity["data"], LoggerRepositoryType>(
  "log",
  "warn",
  (repo) => (...data : unknown[]) : void => {
    repo.readCollection()[0].data.warn(...data);
  },
  true,
);

const successLogAction = new EntityAction<typeof loggerMetaEntity["data"], LoggerRepositoryType>(
  "log",
  "success",
  (repo) => (...data : unknown[]) : void => {
    repo.readCollection()[0].data.success(...data);
  },
  true,
);

const operationLogAction = new EntityAction<typeof loggerMetaEntity["data"], LoggerRepositoryType>(
  "log",
  "operation",
  (repo) => (...data : unknown[]) : void => {
    repo.readCollection()[0].data.operation(...data);
  },
  true,
);

const fatalLogAction = new EntityAction<typeof loggerMetaEntity["data"], LoggerRepositoryType>(
  "log",
  "fatal",
  (repo) => (...data : unknown[]) : void => {
    repo.readCollection()[0].data.fatal(...data);
  },
  true,
);

export const loggerActions = [
  infoLogAction,
  debugLogAction,
  errorLogAction,
  warnLogAction,
  successLogAction,
  operationLogAction,
  fatalLogAction,
];
