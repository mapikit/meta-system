import { SchemasType } from "@api/configuration-de-serializer/domain/schemas-type";
import { MetaRepository } from "@api/entity/domain/meta-repository";
import constants from "@api/mapikit/constants";
import { MongoClient } from "mongodb";
import { handlers } from "./handlers";
import MetaRouter, { HttpMethods } from "./meta-router";

type ExtendedHttpMethods = HttpMethods | "query";

export class SchemaHandler {
  private defaultConnection = new MongoClient(constants.MONGO.URL,
    {
      useUnifiedTopology: true,
      auth: {
        user: constants.MONGO.USER,
        password: constants.MONGO.PASS,
      },
    },
  );

  private schema : SchemasType;
  private repository : MetaRepository;
  public router : MetaRouter;

  constructor (schema : SchemasType) {
    this.schema = schema;
    this.repository = new MetaRepository(this.defaultConnection);
  }

  // eslint-disable-next-line max-lines-per-function
  public async initialize (systemName : string) : Promise<void> {
    this.router = new MetaRouter(`/${systemName}`);
    await this.repository.initialize(this.schema, systemName);

    const idlessRoutes : ExtendedHttpMethods[] = ["query", "post"];
    for(const method of this.getActiveMethods(this.schema.routes)) {
      this.router.createRoute(
        method === "query" ? "get" : method,
        idlessRoutes.includes(method) ? `/${this.schema.name}` : `/${this.schema.name}/:id`,
        handlers[method](this.repository, this.schema.format),
      );
    }
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
