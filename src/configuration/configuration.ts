import { ConfigurationType } from "..";
import { BusinessOperation } from "./business-operations/business-operation";
import { EnvironmentVariable, ProtocolConfigType } from "./configuration-type";
import { Schema } from "./schemas/schema";


export class Configuration implements ConfigurationType {
  public readonly name : string;
  public readonly version : string;
  public readonly envs : EnvironmentVariable[];
  public readonly dbConnectionString : string;
  public readonly schemas : Schema[];
  public readonly protocols : ProtocolConfigType[];
  public readonly businessOperations : BusinessOperation[];

  public constructor (input : ConfigurationType) {
    this.name = input.name;
    this.version = input.version;
    this.envs = input.envs;
    this.dbConnectionString = input.dbConnectionString;
    this.schemas = input.schemas;
    this.businessOperations = input.businessOperations.map((businessOperationData) => {
      return new BusinessOperation(businessOperationData);
    });
    this.protocols = input.protocols;
  }
}
