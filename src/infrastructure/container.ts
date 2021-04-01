import { createContainer, asClass, asValue, AwilixContainer } from "awilix";

import { TYPES } from "./types";
import { SetResponse } from "@api/common/procedures/set-response";
import { SetError } from "@api/common/procedures/set-error";
import { MongoRepository } from "@api/entity/application/repositories/mongo-repository";
import { logger } from "@api/mapikit/logger/logger";
import { InsertEntity } from "@api/entity/domain/procedures/insert-entity";
import { EntityContext } from "@api/entity/domain/contexts/entity-context";
import { EntityController } from "@api/entity/application/routes/entity-controller";
import EntityManager from "@api/entity/application/entity-manager";
import { MapikitRouter } from "@api/mapikit/application/routes/routing";
import { EntityRootRouter } from "@api/entity/application/routes/entity-root";

const container = createContainer();

// MANAGERS
container.register(TYPES.EntityManager, asValue(EntityManager));



// CONTEXTS
container.register(TYPES.EntityContext, asClass(EntityContext));

// PROCEDURES
container.register(TYPES.SetResponse, asClass(SetResponse));
container.register(TYPES.SetError, asClass(SetError));
container.register(TYPES.InsertEntity, asClass(InsertEntity));

// REPOSITORIES
const registerRepositories = async (argContainer : AwilixContainer) : Promise<void> => {
  const mongoRepository = await new MongoRepository().initialize();

  argContainer.register(TYPES.MongoRepository, asValue(mongoRepository));
};

registerRepositories(container)
  .then(() => logger.debug({ message: "Registered repositories successfully" }))
  .catch(() => logger.error({ message: "Failed to register repositories." }));

// ROUTES
container.register(TYPES.EntityRoutes, asClass(EntityController));
container.register(TYPES.EntityRootRoute, asClass(EntityRootRouter));
container.register(TYPES.MapikitRouter, asClass(MapikitRouter));

export { container };
