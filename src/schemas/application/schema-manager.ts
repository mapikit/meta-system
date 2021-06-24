import { SchemasType } from "@api/configuration/schemas/schemas-type";
import { MetaRepository } from "@api/entity/domain/meta-repository";
import { SchemasBopsFunctions } from "@api/schemas/application/schema-bops-functions";

export class SchemaManager {
  public bopsFunctions : SchemasBopsFunctions;

  public constructor (options : {
    schema : SchemasType;
    metaRepository : MetaRepository;
    systemName : string;
  }) {

    this.bopsFunctions = new SchemasBopsFunctions({ MetaRepository: options.metaRepository });
    this.bopsFunctions.schema = options.schema;
  }
}
