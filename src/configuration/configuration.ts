import { ConfigurationType, EnvironmentVariable } from "@api/configuration/configuration-type";
import { BusinessOperation } from "@api/configuration/business-operations/business-operation";
import { Schema } from "@api/configuration/schemas/schema";
import { ProtocolConfigType } from "./protocols/protocol-config-type";


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
