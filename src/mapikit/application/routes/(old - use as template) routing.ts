import { container } from "@api/infrastructure/container";
import { APIRouter } from "@api/common/types/api-router";
import { TYPES } from "@api/infrastructure/types";
import { ClientRootRouter } from "@api/client/application/routes/client-root";
import { SchemaRootRouter } from "@api/entity/application/routes/schemas-root";

export class MapikitRouter extends APIRouter {
  public readonly clientFeatures : ClientRootRouter;
  public readonly schemaFeatures : SchemaRootRouter;

  public constructor () {
    super();

    this.clientFeatures = container.resolve(TYPES.ClientRootRoutes);
    this.schemaFeatures = container.resolve(TYPES.SchemaRootRoute);

    this.router.use(this.clientFeatures.router);
    this.router.use(this.schemaFeatures.router);
  }
}
