import { SchemasType } from "@api/configuration/domain/schemas-type";
import { MetaRepository } from "@api/entity/domain/meta-repository";
import { SchemaRequestHandlers } from "@api/schemas/application/request-handlers";
import MetaRouter, { HttpMethods } from "@api/common/meta-router";

export type ExtendedHttpMethods = HttpMethods | "query";

export class SchemaRoutesManager {
  private schema : SchemasType;
  private repository : MetaRepository;
  public router : MetaRouter;

  constructor (schema : SchemasType, metaRepository : MetaRepository) {
    this.schema = schema;
    this.repository = metaRepository;
  }

  public async initialize (systemName : string) : Promise<void> {
    this.router = new MetaRouter(`/${systemName}`);

    const idlessRoutes : ExtendedHttpMethods[] = ["query", "post"];
    for(const method of this.getActiveMethods(this.schema.routes)) {
      this.router.createRoute(
        method === "query" ? "get" : method,
        idlessRoutes.includes(method) ? `/${this.schema.name}` : `/${this.schema.name}/:id`,
        SchemaRequestHandlers[method](this.repository, this.schema.format),
      );
    }
    await this.repository.initialize(this.schema, systemName);
  }

  private getActiveMethods (methods : SchemasType["routes"]) : Array<ExtendedHttpMethods> {
    const enabledMethods = new Array<ExtendedHttpMethods>(
      methods.deleteMethodEnabled ? "delete" : null,
      methods.patchMethodEnabled ? "patch" : null,
      methods.postMethodEnabled ? "post" : null,
      methods.putMethodEnabled ? "put" : null,
      methods.getMethodEnabled ? "get" : null,
      methods.queryParamsGetEnabled ? "query" : null,
    ).filter(value => value !== null);

    return enabledMethods;
  }
}
