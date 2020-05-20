import { container } from "@api/infrastructure/container";

import { APIRouter } from "@api/common/types/api-router";
import { TYPES } from "@api/infrastructure/types";
import { logger } from "@api/mapikit/logger/logger";
import { ClientSchemaController } from "./client-schemas";

export class SchemaRootRouter extends APIRouter {

  public baseRoute = "/schema";
  public schemaController : ClientSchemaController;

  public constructor () {
    super();
    logger.debug({ message: "Setting up /schemas route" });
    this.schemaController = container.resolve(TYPES.SchemaRoutes);

    this.router.use(this.baseRoute, this.schemaController.schemaEndpoints());
  }

};
