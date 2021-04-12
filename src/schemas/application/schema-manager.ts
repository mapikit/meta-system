import { SchemasType } from "@api/configuration-de-serializer/domain/schemas-type";
import { MetaRepository } from "@api/entity/domain/meta-repository";
import { SchemasBopsFunctions } from "./schema-bops-functions";
import { SchemaRoutesManager } from "./schema-routes-manager";

export class SchemaManager {
  public bopsFunctions : SchemasBopsFunctions;
  public router : SchemaRoutesManager;
  private readonly systemName : string;

  public constructor (options : {
    schema : SchemasType;
    metaRepository : MetaRepository;
    systemName : string;
  }) {
    this.router = new SchemaRoutesManager(options.schema, options.metaRepository);
    this.systemName = options.systemName;

    this.bopsFunctions = new SchemasBopsFunctions({ MetaRepository: options.metaRepository });
    this.bopsFunctions.schema = options.schema;
  }

  public async activateSchemaRoutes () : Promise<void> {
    await this.router.initialize(this.systemName);
  }
}
