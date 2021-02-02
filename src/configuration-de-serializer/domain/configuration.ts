import { BusinessOperations } from "./business-operations-type";
import { ConfigurationType, EnvironmentVariable } from "./configuration-type";
import { SchemasType } from "./schemas-type";

export class Configuration implements ConfigurationType {
  public readonly name : string;
  public readonly version : string;
  public readonly port : number;
  public readonly envs : EnvironmentVariable[];
  public readonly dbConnectionString : string;
  public readonly schemas : SchemasType[];
  public readonly businessOperations : BusinessOperations[];

  public constructor (input : ConfigurationType) {
    this.name = input.name;
    this.version = input.version;
    this.port = input.port;
    this.envs = input.envs;
    this.dbConnectionString = input.dbConnectionString;
    this.schemas = input.schemas;
    this.businessOperations = input.businessOperations;
  }
}
