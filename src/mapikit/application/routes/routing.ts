import { container } from "@api/infrastructure/container";
import { APIRouter } from "@api/common/types/api-router";
import { TYPES } from "@api/infrastructure/types";
import { EntityRootRouter } from "@api/entity/application/routes/entity-root";


export class MapikitRouter extends APIRouter {
  public readonly entityFeatures : EntityRootRouter;

  public constructor () {
    super();

    this.entityFeatures = container.resolve(TYPES.EntityRootRoute);

    this.router.use(this.entityFeatures.router);
  }
}
