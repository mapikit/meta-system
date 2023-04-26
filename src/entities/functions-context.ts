import { ConfigurationType } from "../configuration/configuration-type.js";
import { EntityValue, MetaEntity } from "./meta-entity.js";
import { BrokerFactory, EntityBroker } from "../broker/entity-broker.js";
import constants from "../common/constants.js";
import { EntityRepository } from "./repository.js";
import { InternalMetaFunction } from "bops-functions/internal-meta-function.js";
import { EntityAction } from "./entity-action.js";
import { nanoid } from "nanoid";

type FunctionEntity = EntityValue & InternalMetaFunction & {
  callable : Function;
}

export class FunctionsContext {
  private readonly schemaFunctions : MetaEntity<FunctionEntity>[]= [];
  private readonly bopsFunctions : MetaEntity<FunctionEntity>[] = [];
  private readonly addonsFunctions : MetaEntity<FunctionEntity>[] = [];
  private readonly internalFunctions : MetaEntity<FunctionEntity>[] = [];
  private readonly functions : MetaEntity<{ list : MetaEntity<FunctionEntity>[] } & EntityValue>[] = [];

  public readonly systemConfig : ConfigurationType;
  public readonly broker : EntityBroker;

  // eslint-disable-next-line max-lines-per-function
  public constructor (options : {
    systemConfig : ConfigurationType;
  }) {
    this.systemConfig = options.systemConfig;

    const factory = new BrokerFactory();
    this.broker = factory
      .configEntity("schemaFunctions", FunctionsContext.getSchemaFunctionsActions(),
        new EntityRepository(this.schemaFunctions))
      .useEntity({ entity: "schemaFunctions", permissions: [constants.PERMISSION_OVERRIDE_VALUE] })
      .build();
  }

  private static getSchemaFunctionsActions () : EntityAction<FunctionEntity, EntityRepository<FunctionEntity>>[] {
    const result = [];

    result.push(new EntityAction(nanoid(), "setSchemaFunction", (repo : EntityRepository<FunctionEntity>) =>
      (definition : InternalMetaFunction, schemaName : string, callable : Function) => {
        repo.createEntity(new MetaEntity("",
          { callable, identifier: `${definition.functionName}@${schemaName}`, ...definition }));
      }, false));

    result.push(new EntityAction(nanoid(), "getSchemaFunction", (repo : EntityRepository<FunctionEntity>) =>
      (functionName : string, schemaName : string) => {
        return repo.getEntity(`${functionName}@${schemaName}`).data.callable;
      }, true));

    return result;
  }

  // public getDataSources () :
}
