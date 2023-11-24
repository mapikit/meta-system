import { EntityValue, MetaEntity } from "./meta-entity.js";
import { BrokerFactory, EntityBroker, EntityPermissions } from "../broker/entity-broker.js";
import constants from "../common/constants.js";
import { EntityRepository } from "./repository.js";
import { InternalMetaFunction } from "../bops-functions/internal-meta-function.js";
import { EntityAction } from "./entity-action.js";
import { validateDefinition } from "./helpers/validate-definition.js";
import { DiffManager } from "../configuration/diff/diff-manager.js";
import { checkEntityDiff } from "../configuration/diff/check-entity-diff.js";

export type FunctionEntity = EntityValue & InternalMetaFunction & {
  callable : Function;
}

export class FunctionsContext {
  private readonly schemaFunctions : MetaEntity<FunctionEntity>[]= [];
  private readonly bopsFunctions : MetaEntity<FunctionEntity>[] = [];
  private readonly addonsFunctions : MetaEntity<FunctionEntity>[] = [];
  private readonly internalFunctions : MetaEntity<FunctionEntity>[] = [];

  public readonly systemBroker : EntityBroker;

  // eslint-disable-next-line max-lines-per-function
  public constructor (private diffManager : DiffManager) {
    const factory = new BrokerFactory();
    this.systemBroker = factory
      .configEntity("schemaFunctions", this.getSchemaFunctionsActions(constants.RUNTIME_ENGINE_IDENTIFIER),
        new EntityRepository(this.schemaFunctions))
      .useEntity({ entity: "schemaFunctions", permissions: [constants.PERMISSION_OVERRIDE_VALUE] })
      .configEntity("bopFunctions", this.getBopsFunctionsActions(constants.RUNTIME_ENGINE_IDENTIFIER),
        new EntityRepository(this.bopsFunctions))
      .useEntity({ entity: "bopFunctions", permissions: [constants.PERMISSION_OVERRIDE_VALUE] })
      .configEntity("addonsFunctions", this.getAddonsFunctionsActions(constants.RUNTIME_ENGINE_IDENTIFIER),
        new EntityRepository(this.addonsFunctions))
      .useEntity({ entity: "addonsFunctions", permissions: [constants.PERMISSION_OVERRIDE_VALUE] })
      .configEntity(
        "internalFunctions",
        this.getInternalFunctionsActions(constants.RUNTIME_ENGINE_IDENTIFIER),
        new EntityRepository(this.internalFunctions))
      .useEntity({ entity: "internalFunctions", permissions: [constants.PERMISSION_OVERRIDE_VALUE] })
      .build();
  }

  // eslint-disable-next-line max-lines-per-function
  private getInternalFunctionsActions (identifier : string)
    : EntityAction<FunctionEntity, EntityRepository<FunctionEntity>>[] {
    const result = [];

    result.push(new EntityAction("set_functions", "setFunction",
      (repo : EntityRepository<FunctionEntity>) =>
        (callable : Function, definition : InternalMetaFunction) => {
          validateDefinition(definition, definition.functionName);
          const newEntity = new MetaEntity(identifier,
            { callable, identifier: `${definition.functionName}`, ...definition });

          repo.createEntity(newEntity);
          this.diffManager.addManyDiffsFromCheck(
            checkEntityDiff(definition.functionName, identifier, "internalFunctions", {}, newEntity.data),
          );

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
          const newOne = new MetaEntity(identifier,
            { ...oldOne.data, callable });
          repo.updateEntity(newOne);
          this.diffManager.addManyDiffsFromCheck(
            checkEntityDiff(name, identifier, "internalFunctions", oldOne.data, newOne.data),
          );
        }, false));

    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  private getSchemaFunctionsActions (identifier : string)
    : EntityAction<FunctionEntity, EntityRepository<FunctionEntity>>[] {
    const result = [];
    const empty = () : void => { void 0; };

    result.push(new EntityAction("preregister_functions", "preRegisterSchemaFunction",
      (repo : EntityRepository<FunctionEntity>) =>
        (schemaIdentifier : string, definition : InternalMetaFunction) => {
          validateDefinition(definition, `${identifier} - ${schemaIdentifier}@${definition.functionName}`);
          repo.createEntity(new MetaEntity(identifier,
            { callable: empty, identifier: `${schemaIdentifier}@${definition.functionName}`, ...definition }));
        }, false));

    result.push(new EntityAction("set_registered_functions", "setRegisteredSchemaFunction",
      (repo : EntityRepository<FunctionEntity>) =>
        (schemaIdentifier : string, functionName : string, callable : Function) => {
          const entity = repo.getEntity(`${schemaIdentifier}@${functionName}`);
          if(!entity) return;
          entity.data.callable = callable;
          repo.updateEntity(entity);

          this.diffManager.addManyDiffsFromCheck(
            checkEntityDiff(`${schemaIdentifier}@${functionName}`, identifier,
              "schemaFunctions",
              {},
              entity.data,
            ),
          );
        }, true));

    result.push(new EntityAction("set_functions", "setSchemaFunction",
      (repo : EntityRepository<FunctionEntity>) =>
        (schemaIdentifier : string, callable : Function, definition : InternalMetaFunction) => {
          validateDefinition(definition, `${identifier} - ${schemaIdentifier}@${definition.functionName}`);
          const newEntity = new MetaEntity(identifier,
            { callable, identifier: `${schemaIdentifier}@${definition.functionName}`, ...definition });

          repo.createEntity(newEntity);

          this.diffManager.addManyDiffsFromCheck(
            checkEntityDiff(`${schemaIdentifier}@${definition.functionName}`,
              identifier, "schemaFunctions", {}, newEntity.data),
          );

        }, false));

    result.push(new EntityAction("get_functions", "getSchemaFunction", (repo : EntityRepository<FunctionEntity>) =>
      (functionName : string, schemaIdentifier : string) => {
        return repo.getEntity(`${schemaIdentifier}@${functionName}`)?.data.callable;
      }, true));

    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  private getBopsFunctionsActions (identifier : string)
    : EntityAction<FunctionEntity, EntityRepository<FunctionEntity>>[] {
    const result = [];

    result.push(new EntityAction("override_call", "overrideBopCall", (repo : EntityRepository<FunctionEntity>) =>
      (bopIdentifier : string, callable : Function, definition : InternalMetaFunction) => {
        validateDefinition(definition, identifier);
        const newEntity = new MetaEntity(identifier,{ callable, identifier: bopIdentifier, ...definition });
        const oldEntity = repo.getEntity(bopIdentifier);
        repo.updateEntity(newEntity);

        this.diffManager.addManyDiffsFromCheck(
          checkEntityDiff(bopIdentifier, identifier, "bopsFunctions", oldEntity.data, newEntity.data),
        );
      }, true));

    result.push(new EntityAction("add_function", "addBopCall", (repo : EntityRepository<FunctionEntity>) =>
      (bopIdentifier : string, callable : Function, definition : InternalMetaFunction) => {
        const newEntity = new MetaEntity(identifier, { callable, identifier: bopIdentifier, ...definition });
        repo.createEntity(newEntity);

        this.diffManager.addManyDiffsFromCheck(
          checkEntityDiff(bopIdentifier, identifier, "bopsFunctions", {}, newEntity.data),
        );
        return;
      }, true));

    result.push(new EntityAction("get_function", "getBopFunction", (repo : EntityRepository<FunctionEntity>) =>
      (bopIdentifier : string) => {
        return repo.getEntity(bopIdentifier)?.data.callable;
      }, true));

    result.push(new EntityAction("get_all", "getAll", (repo : EntityRepository<FunctionEntity>) =>
      () => {
        return repo.readCollection().map(item => item?.data).filter(item => item);
      }, true));

    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  private getAddonsFunctionsActions (identifier : string)
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

    result.push(new EntityAction("getFromIdentifier", "getFromIdentifier", (repo : EntityRepository<FunctionEntity>) =>
      (addonIdentifier : string) => {
        return repo.readCollection()
          .map(item => item?.data)
          .filter(item => item.identifier.startsWith(addonIdentifier));
      }, false));

    result.push(new EntityAction("register", "register", (repo : EntityRepository<FunctionEntity>) =>
      (callable : Function, definition : InternalMetaFunction) => {
        validateDefinition(definition, `${identifier} - ${definition.functionName}`);
        const newEntity = new MetaEntity(identifier, {
          callable, identifier: `${identifier}@${definition.functionName}`, ...definition });

        repo.createEntity(newEntity);

        this.diffManager.addManyDiffsFromCheck(
          checkEntityDiff(`${identifier}@${definition.functionName}`,
            identifier, "addonsFunctions", {}, newEntity.data),
        );
      }, false));

    result.push(new EntityAction("preregister", "preregister", (repo : EntityRepository<FunctionEntity>) =>
      (definition : InternalMetaFunction) => {
        validateDefinition(definition, `${identifier} - ${definition.functionName}`);
        return repo.createEntity(new MetaEntity(identifier, {
          callable: empty, identifier: `${identifier}@${definition.functionName}`, ...definition }));
      }, false));

    result.push(new EntityAction("set_registered", "setRegistered", (repo : EntityRepository<FunctionEntity>) =>
      (functionName : string, callable : Function) => {
        const entity = repo.getEntity(`${identifier}@${functionName}`);
        if(!entity) return;
        entity.data.callable = callable;
        repo.updateEntity(entity);

        this.diffManager.addManyDiffsFromCheck(
          checkEntityDiff(`${identifier}@${functionName}`,
            identifier, "addonsFunctions", {}, entity.data),
        );

      }, true));

    return result;
  }

  public createBroker (accesses : EntityPermissions[], identifier : string) : EntityBroker {
    const factory = new BrokerFactory()
      .configEntity("schemaFunctions", this.getSchemaFunctionsActions(identifier),
        new EntityRepository(this.schemaFunctions))
      .configEntity("bopFunctions", this.getBopsFunctionsActions(identifier),
        new EntityRepository(this.bopsFunctions))
      .configEntity("addonsFunctions", this.getAddonsFunctionsActions(identifier),
        new EntityRepository(this.addonsFunctions));

    accesses.forEach((access) => {
      factory.useEntity(access);
    });

    return factory.build();
  }
}
