import { MetaRepository } from "../../common/meta-repository";
import { SchemasType } from "../../configuration/schemas/schemas-type";
import { SchemasBopsFunctions } from "./schema-bops-functions";

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
