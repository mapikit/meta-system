import { createContainer, asClass, asValue, AwilixContainer } from "awilix";

import { TYPES } from "./types";
import { TypeOrmClientRepository } from "@api/client/application/repositories/typeorm-client-repository";
import { ClientAccountController } from "@api/client/application/routes/client-account";
import { MapikitRouter } from "@api/mapikit/application/routes/routing";
import { ClientRootRouter } from "@api/client/application/routes/client-root";
import { ClientContext } from "@api/client/domain/contexts/client-context";
import { SetResponse } from "@api/common/procedures/set-response";
import { RegisterClient } from "@api/client/domain/procedures/register-client";
import { LoginClient } from "@api/client/domain/procedures/login-client";
import ClientManager from "@api/client/application/manager";
import SchemaManager from "@api/entity/application/schema-manager";
import { SetError } from "@api/common/procedures/set-error";
import { SchemaRootRouter } from "@api/entity/application/routes/schemas-root";
import { ClientSchemaController } from "@api/entity/application/routes/client-schemas";
import { SchemaContext } from "@api/entity/domain/contexts/schema-context";
import { TypeOrmSchemaRepository } from "@api/entity/application/repositories/typeorm-schema-repository";
import { MongoRepository } from "@api/entity/application/repositories/mongo-repository";
import { logger } from "@api/mapikit/logger/logger";
import { CreateSchema } from "@api/entity/domain/procedures/create-schema";
import { GetSchemas } from "@api/entity/domain/procedures/get-schemas";
import { SearchSchema } from "@api/entity/domain/procedures/search-schema";


const container = createContainer();

// MANAGERS
container.register(TYPES.ClientManager, asValue(ClientManager));
container.register(TYPES.SchemaManager, asValue(SchemaManager));


// CONTEXTS
container.register(TYPES.ClientContext, asClass(ClientContext));
container.register(TYPES.SchemaContext, asClass(SchemaContext));


// PROCEDURES
container.register(TYPES.SetResponse, asClass(SetResponse));
container.register(TYPES.SetError, asClass(SetError));
container.register(TYPES.RegisterClient, asClass(RegisterClient));
container.register(TYPES.LoginClient, asClass(LoginClient));
container.register(TYPES.CreateSchema, asClass(CreateSchema));
container.register(TYPES.GetSchemas, asClass(GetSchemas));
container.register(TYPES.SearchSchema, asClass(SearchSchema));

// REPOSITORIES
const registerRepositories = async (argContainer : AwilixContainer) : Promise<void> => {
  const clientRepository = await new TypeOrmClientRepository().initiate();
  const schemaRepository = await new TypeOrmSchemaRepository().initiate();
  const mongoRepository = await new MongoRepository().initialize();

  argContainer.register(TYPES.ClientRepository, asValue(clientRepository));
  argContainer.register(TYPES.SchemaRepository, asValue(schemaRepository));
  argContainer.register(TYPES.MongoRepository, asValue(mongoRepository));
};

registerRepositories(container)
  .then(() => logger.debug({ message: "Registered repositories successfully" }))
  .catch(() => logger.error({ message: "Failed to register repositories." }));

// ROUTES
container.register(TYPES.ClientAccountRoutes, asClass(ClientAccountController));
container.register(TYPES.ClientRootRoutes, asClass(ClientRootRouter));
container.register(TYPES.MapikitRouter, asClass(MapikitRouter));
container.register(TYPES.SchemaRootRoute, asClass(SchemaRootRouter));
container.register(TYPES.SchemaRoutes, asClass(ClientSchemaController));

export { container };
