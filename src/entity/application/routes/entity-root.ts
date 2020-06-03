import { container } from "@api/infrastructure/container";

import { APIRouter } from "@api/common/types/api-router";
import { TYPES } from "@api/infrastructure/types";
import { logger } from "@api/mapikit/logger/logger";
import { EntityController } from "./entity-controller";

export class EntityRootRouter extends APIRouter {

  public baseRoute = "/entity";
  public entityController : EntityController;

  public constructor () {
    super();
    logger.debug({ message: "Setting up /entity route" });
    this.entityController = container.resolve(TYPES.EntityRoutes);

    this.router.use(this.baseRoute, this.entityController.entityEndpoints());
  }

};
