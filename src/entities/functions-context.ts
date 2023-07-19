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
      .configEntity("schemaFunctions", FunctionsContext.getSchemaFunctionsActions(constants.RUNTIME_ENGINE_IDENTIFIER),
        new EntityRepository(this.schemaFunctions))
      .useEntity({ entity: "schemaFunctions", permissions: [constants.PERMISSION_OVERRIDE_VALUE] })
      .configEntity("bopFunctions", FunctionsContext.getBopsFunctionsActions(constants.RUNTIME_ENGINE_IDENTIFIER),
        new EntityRepository(this.bopsFunctions))
      .useEntity({ entity: "bopFunctions", permissions: [constants.PERMISSION_OVERRIDE_VALUE] })
      .configEntity("addonsFunctions", FunctionsContext.getAddonsFunctionsActions(constants.RUNTIME_ENGINE_IDENTIFIER),
        new EntityRepository(this.addonsFunctions))
      .useEntity({ entity: "addonsFunctions", permissions: [constants.PERMISSION_OVERRIDE_VALUE] })
      .configEntity(
        "internalFunctions",
        FunctionsContext.getInternalFunctionsActions(constants.RUNTIME_ENGINE_IDENTIFIER),
        new EntityRepository(this.internalFunctions))
      .useEntity({ entity: "internalFunctions", permissions: [constants.PERMISSION_OVERRIDE_VALUE] })
      .build();
  }

  // eslint-disable-next-line max-lines-per-function
  private static getInternalFunctionsActions (identifier : string)
    : EntityAction<FunctionEntity, EntityRepository<FunctionEntity>>[] {
    const result = [];

    result.push(new EntityAction("set_functions", "setFunction",
      (repo : EntityRepository<FunctionEntity>) =>
        (callable : Function, definition : InternalMetaFunction) => {
          repo.createEntity(new MetaEntity(identifier,
            { callable, identifier: `${definition.functionName}`, ...definition }));
        }, false));

    result.push(new EntityAction("get_functions", "getFunction", (repo : EntityRepository<FunctionEntity>) =>
      (functionName : string) => {
        return repo.getEntity(`${functionName}`)?.data.callable;
      }, true));

    result.push(new EntityAction("overrride_functions", "override",
      (repo : EntityRepository<FunctionEntity>) =>
        (name : string, callable : Function) => {
          const oldOne = repo.getEntity(name);
          if(!oldOne) return;
          repo.updateEntity(new MetaEntity(identifier,
            { ...oldOne.data, callable }));
        }, false));

    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  private static getSchemaFunctionsActions (identifier : string)
    : EntityAction<FunctionEntity, EntityRepository<FunctionEntity>>[] {
    const result = [];
    const empty = () : void => { void 0; };

    result.push(new EntityAction("preregister_functions", "preRegisterSchemaFunction",
      (repo : EntityRepository<FunctionEntity>) =>
        (schemaName : string, definition : InternalMetaFunction) => {
          repo.createEntity(new MetaEntity(identifier,
            { callable: empty, identifier: `${schemaName}@${definition.functionName}`, ...definition }));
        }, false));

    result.push(new EntityAction("set_registered_functions", "setRegisteredSchemaFunction",
      (repo : EntityRepository<FunctionEntity>) =>
        (schemaName : string, functionName : string, callable : Function) => {
          const entity = repo.getEntity(`${schemaName}@${functionName}`);
          if(!entity) return;
          entity.data.callable = callable;
          repo.updateEntity(entity);
        }, true));

    result.push(new EntityAction("set_functions", "setSchemaFunction",
      (repo : EntityRepository<FunctionEntity>) =>
        (schemaName : string, callable : Function, definition : InternalMetaFunction) => {
          repo.createEntity(new MetaEntity(identifier,
            { callable, identifier: `${schemaName}@${definition.functionName}`, ...definition }));
        }, false));

    result.push(new EntityAction("get_functions", "getSchemaFunction", (repo : EntityRepository<FunctionEntity>) =>
      (functionName : string, schemaName : string) => {
        return repo.getEntity(`${schemaName}@${functionName}`)?.data.callable;
      }, true));

    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  private static getBopsFunctionsActions (identifier : string)
    : EntityAction<FunctionEntity, EntityRepository<FunctionEntity>>[] {
    const result = [];

    result.push(new EntityAction("override_call", "overrideBopCall", (repo : EntityRepository<FunctionEntity>) =>
      (bopName : string, callable : Function, definition : InternalMetaFunction) => {
        repo.updateEntity(new MetaEntity(identifier,{ callable, identifier: bopName, ...definition }));
      }, false));

    result.push(new EntityAction("add_function", "addBopCall", (repo : EntityRepository<FunctionEntity>) =>
      (bopName : string, callable : Function, definition : InternalMetaFunction) => {
        return repo.createEntity(new MetaEntity(identifier, { callable, identifier: bopName, ...definition }));
      }, false));

    result.push(new EntityAction("get_function", "getBopFunction", (repo : EntityRepository<FunctionEntity>) =>
      (bopName : string) => {
        return repo.getEntity(bopName)?.data.callable;
      }, true));

    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  private static getAddonsFunctionsActions (identifier : string)
    : EntityAction<FunctionEntity, EntityRepository<FunctionEntity>>[] {
    const result = [];
    const empty = () : void => { void 0; };

    result.push(new EntityAction("get", "getFunction", (repo : EntityRepository<FunctionEntity>) => {
      return (functionName : string) => {
        return repo.getEntity(`${identifier}@${functionName}`)?.data.callable;
      };}, true));

    result.push(new EntityAction("getOthers", "getAddonFunction", (repo : EntityRepository<FunctionEntity>) => {
      return (addonIdentifier : string, functionName : string) => {
        return repo.getEntity(`${addonIdentifier}@${functionName}`)?.data.callable;
      };}, true));

    result.push(new EntityAction("getAll", "getAll", (repo : EntityRepository<FunctionEntity>) =>
      () => {
        return repo.readCollection().map(item => item?.data).filter(item => item);
      }, false));

    result.push(new EntityAction("register", "register", (repo : EntityRepository<FunctionEntity>) =>
      (callable : Function, definition : InternalMetaFunction) => {
        return repo.createEntity(new MetaEntity(identifier, {
          callable, identifier: `${identifier}@${definition.functionName}`, ...definition }));
      }, false));

    result.push(new EntityAction("preregister", "preregister", (repo : EntityRepository<FunctionEntity>) =>
      (definition : InternalMetaFunction) => {
        return repo.createEntity(new MetaEntity(identifier, {
          callable: empty, identifier: `${identifier}@${definition.functionName}`, ...definition }));
      }, false));

    result.push(new EntityAction("set_registered", "setRegistered", (repo : EntityRepository<FunctionEntity>) =>
      (functionName : string, callable : Function) => {
        const entity = repo.getEntity(`${identifier}@${functionName}`);
        if(!entity) return;
        entity.data.callable = callable;
        repo.updateEntity(entity);
      }, true));

    return result;
  }

  public createBroker (accesses : EntityPermissions[], identifier : string) : EntityBroker {
    const factory = new BrokerFactory()
      .configEntity("schemaFunctions", FunctionsContext.getSchemaFunctionsActions(identifier),
        new EntityRepository(this.schemaFunctions))
      .configEntity("bopFunctions", FunctionsContext.getBopsFunctionsActions(identifier),
        new EntityRepository(this.bopsFunctions))
      .configEntity("addonsFunctions", FunctionsContext.getAddonsFunctionsActions(identifier),
        new EntityRepository(this.addonsFunctions));

    accesses.forEach((access) => {
      factory.useEntity(access);
    });

    return factory.build();
  }
}
