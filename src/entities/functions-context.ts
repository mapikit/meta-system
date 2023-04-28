import { EntityValue, MetaEntity } from "./meta-entity.js";
import { BrokerFactory, EntityBroker, EntityPermissions } from "../broker/entity-broker.js";
import constants from "../common/constants.js";
import { EntityRepository } from "./repository.js";
import { InternalMetaFunction } from "bops-functions/internal-meta-function.js";
import { EntityAction } from "./entity-action.js";

type FunctionEntity = EntityValue & InternalMetaFunction & {
  callable : Function;
}

export class FunctionsContext {
  private readonly schemaFunctions : MetaEntity<FunctionEntity>[]= [];
  private readonly bopsFunctions : MetaEntity<FunctionEntity>[] = [];
  private readonly addonsFunctions : MetaEntity<FunctionEntity>[] = [];
  private readonly internalFunctions : MetaEntity<FunctionEntity>[] = [];

  public readonly systemBroker : EntityBroker;

  // eslint-disable-next-line max-lines-per-function
  public constructor () {
    const factory = new BrokerFactory();
    this.systemBroker = factory
      .configEntity("schemaFunctions", FunctionsContext.getSchemaFunctionsActions(),
        new EntityRepository(this.schemaFunctions))
      .useEntity({ entity: "schemaFunctions", permissions: [constants.PERMISSION_OVERRIDE_VALUE] })
      .configEntity("bopFunctions", FunctionsContext.getBopsFunctionsActions(),
        new EntityRepository(this.bopsFunctions))
      .useEntity({ entity: "bopFunctions", permissions: [constants.PERMISSION_OVERRIDE_VALUE] })
      .configEntity("addonsFunctions", FunctionsContext.getAddonsFunctionsActions(),
        new EntityRepository(this.addonsFunctions))
      .useEntity({ entity: "addonsFunctions", permissions: [constants.PERMISSION_OVERRIDE_VALUE] })
      .configEntity("internalFunctions", FunctionsContext.getInternalFunctionsActions(),
        new EntityRepository(this.internalFunctions))
      .useEntity({ entity: "internalFunctions", permissions: [constants.PERMISSION_OVERRIDE_VALUE] })
      .build();
  }

  private static getInternalFunctionsActions () : EntityAction<FunctionEntity, EntityRepository<FunctionEntity>>[] {
    const result = [];

    result.push(new EntityAction("set_functions", "setFunction",
      (repo : EntityRepository<FunctionEntity>) =>
        (section : string, callable : Function, definition : InternalMetaFunction) => {
          repo.createEntity(new MetaEntity("",
            { callable, identifier: `${section}@${definition.functionName}`, ...definition }));
        }, false));

    result.push(new EntityAction("get_functions", "getFunction", (repo : EntityRepository<FunctionEntity>) =>
      (functionName : string, section : string) => {
        return repo.getEntity(`${section}@${functionName}`).data.callable;
      }, true));

    return result;
  }

  private static getSchemaFunctionsActions () : EntityAction<FunctionEntity, EntityRepository<FunctionEntity>>[] {
    const result = [];

    result.push(new EntityAction("set_functions", "setSchemaFunction",
      (repo : EntityRepository<FunctionEntity>) =>
        (schemaName : string, callable : Function, definition : InternalMetaFunction) => {
          repo.createEntity(new MetaEntity("",
            { callable, identifier: `${schemaName}@${definition.functionName}`, ...definition }));
        }, false));

    result.push(new EntityAction("get_functions", "getSchemaFunction", (repo : EntityRepository<FunctionEntity>) =>
      (functionName : string, schemaName : string) => {
        return repo.getEntity(`${schemaName}@${functionName}`).data.callable;
      }, true));

    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  private static getBopsFunctionsActions () : EntityAction<FunctionEntity, EntityRepository<FunctionEntity>>[] {
    const result = [];

    result.push(new EntityAction("override_call", "overrideBopCall", (repo : EntityRepository<FunctionEntity>) =>
      (bopName : string, callable : Function, definition : InternalMetaFunction) => {
        repo.updateEntity(new MetaEntity("",{ callable, identifier: bopName, ...definition }));
      }, false));

    result.push(new EntityAction("add_function", "addBopCall", (repo : EntityRepository<FunctionEntity>) =>
      (bopName : string, callable : Function, definition : InternalMetaFunction) => {
        return repo.createEntity(new MetaEntity("", { callable, identifier: bopName, ...definition }));
      }, false));

    result.push(new EntityAction("get_function", "getBopFunction", (repo : EntityRepository<FunctionEntity>) =>
      (bopName : string) => {
        return repo.getEntity(bopName).data.callable;
      }, true));

    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  private static getAddonsFunctionsActions () : EntityAction<FunctionEntity, EntityRepository<FunctionEntity>>[] {
    const result = [];
    const empty = () : void => { void 0; };

    result.push(new EntityAction("get", "getFunction", (repo : EntityRepository<FunctionEntity>) =>
      (addonName : string, functionName : string) => {
        return repo.getEntity(`${addonName}@${functionName}`).data.callable;
      }, false));

    result.push(new EntityAction("register", "register", (repo : EntityRepository<FunctionEntity>) =>
      (addonName : string, callable : Function, definition : InternalMetaFunction) => {
        return repo.createEntity(new MetaEntity("", {
          callable, identifier: `${addonName}@${definition.functionName}`, ...definition }));
      }, false));

    result.push(new EntityAction("preregister", "preregister", (repo : EntityRepository<FunctionEntity>) =>
      (addonName : string, definition : InternalMetaFunction) => {
        return repo.createEntity(new MetaEntity("", {
          callable: empty, identifier: `${addonName}@${definition.functionName}`, ...definition }));
      }, false));

    result.push(new EntityAction("set_registered", "setRegistered", (repo : EntityRepository<FunctionEntity>) =>
      (addonName : string, functionName : string, callable : Function) => {
        const entity = repo.getEntity(`${addonName}@${functionName}`);
        entity.data.callable = callable;
        repo.updateEntity(entity);
      }, true));

    return result;
  }

  public createBroker (accesses : EntityPermissions[]) : EntityBroker {
    const factory = new BrokerFactory()
      .configEntity("schemaFunctions", FunctionsContext.getSchemaFunctionsActions(),
        new EntityRepository(this.schemaFunctions))
      .configEntity("bopFunctions", FunctionsContext.getBopsFunctionsActions(),
        new EntityRepository(this.bopsFunctions))
      .configEntity("addonsFunctions", FunctionsContext.getAddonsFunctionsActions(),
        new EntityRepository(this.addonsFunctions));

    accesses.forEach((access) => {
      factory.useEntity(access);
    });

    return factory.build();
  }
}
