import { ConfigurationType } from "../configuration/configuration-type.js";
import { EntityValue, MetaEntity } from "./meta-entity.js";
import { BusinessOperation } from "../configuration/business-operations/business-operation.js";
import { Schema } from "../configuration/schemas/schema.js";
import { Addon } from "../configuration/addon-type.js";
import { BrokerFactory, EntityBroker, EntityPermissions } from "../broker/entity-broker.js";
import constants from "../common/constants.js";
import { EntityRepository } from "./repository.js";
import { EntityAction } from "./entity-action.js";

type EnvironmentVariables = EntityValue & {
  value : string;
};

export class SystemContext {
  private readonly envs : MetaEntity<EnvironmentVariables>[]= [];
  private readonly schemas : MetaEntity<Schema>[] = [];
  private readonly businessOperations : MetaEntity<BusinessOperation>[] = [];
  private readonly addons : MetaEntity<Addon>[] = [];

  public readonly systemConfig : ConfigurationType;
  public readonly systemBroker : EntityBroker;

  // eslint-disable-next-line max-lines-per-function
  public constructor (systemConfig : ConfigurationType) {
    this.systemConfig = systemConfig;

    this.businessOperations = systemConfig.businessOperations.map(bop => new MetaEntity("", bop));
    this.addons = systemConfig.addons.map(addon => new MetaEntity("", addon));
    this.schemas = systemConfig.schemas.map(schema => new MetaEntity("", schema));
    // this.envs = systemConfig.envs.map(env => new MetaEntity("", env));

    const factory = new BrokerFactory();
    this.systemBroker = factory
      .configEntity("schemas", SystemContext.getSchemasActions(),
        new EntityRepository(this.schemas))
      .useEntity({ entity: "schemas", permissions: [constants.PERMISSION_OVERRIDE_VALUE] },
        new EntityRepository(this.schemas))
      .configEntity("businessOperations", SystemContext.getBopsActions(),
        new EntityRepository(this.businessOperations))
      .useEntity({ entity: "businessOperations", permissions: [constants.PERMISSION_OVERRIDE_VALUE] })
      .configEntity("envs", SystemContext.getEnvsActions(),
        new EntityRepository(this.envs))
      .useEntity({ entity: "envs", permissions: [constants.PERMISSION_OVERRIDE_VALUE] })
      .configEntity("addons", SystemContext.getAddonsActions(),
        new EntityRepository(this.addons))
      .useEntity({ entity: "addons", permissions: [constants.PERMISSION_OVERRIDE_VALUE] })
      .build();
  }

  public createBroker (accesses : EntityPermissions[]) : EntityBroker {
    const factory = new BrokerFactory()
      .configEntity("schemas", SystemContext.getSchemasActions(),
        new EntityRepository(this.schemas))
      .configEntity("businessOperations", SystemContext.getBopsActions(),
        new EntityRepository(this.businessOperations))
      .configEntity("envs", SystemContext.getEnvsActions(),
        new EntityRepository(this.envs))
      .configEntity("addons", SystemContext.getAddonsActions(),
        new EntityRepository(this.addons));

    accesses.forEach((access) => {
      factory.useEntity(access);
    });

    return factory.build();
  }

  // eslint-disable-next-line max-lines-per-function
  private static getBopsActions () : EntityAction<BusinessOperation, EntityRepository<BusinessOperation>>[] {
    const result = [];

    result.push(new EntityAction("get_bop", "getBop",
      (repo : EntityRepository<BusinessOperation>) =>
        (bopIdentifier : string) => repo.getEntity(bopIdentifier)?.data,
    ));

    result.push(new EntityAction("create_bop", "createBop",
      (repo : EntityRepository<BusinessOperation>) =>
        (bop : BusinessOperation) => repo.createEntity(new MetaEntity("", bop)),
    ));

    result.push(new EntityAction("get_all", "getAll",
      (repo : EntityRepository<BusinessOperation>) =>
        () => repo.readCollection().map(entity => entity?.data).filter(entity => entity),
    ));

    return result;
  }


  // eslint-disable-next-line max-lines-per-function
  private static getSchemasActions () : EntityAction<Schema, EntityRepository<Schema>>[] {
    const result = [];

    result.push(new EntityAction("get_schema", "getSchema",
      (repo : EntityRepository<Schema>) =>
        (schemaIdentifier : string) => repo.getEntity(schemaIdentifier)?.data,
    ));

    result.push(new EntityAction("create_schema", "createSchema",
      (repo : EntityRepository<Schema>) =>
        (schema : Schema) => repo.createEntity(new MetaEntity("", schema)),
    ));

    result.push(new EntityAction("get_all", "getAll",
      (repo : EntityRepository<Schema>) =>
        () => repo.readCollection().map(entity => entity?.data).filter(entity => entity),
    ));

    result.push(new EntityAction("modify_schema", "modifySchema",
      (repo : EntityRepository<Schema>) =>
        (schema : Schema) => {
          repo.updateEntity(new MetaEntity("", schema));
        }));

    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  private static getAddonsActions () : EntityAction<Addon, EntityRepository<Addon>>[] {
    const result = [];

    result.push(new EntityAction("get_addon", "getAddon",
      (repo : EntityRepository<Addon>) =>
        (addonIdentifier : string) => repo.getEntity(addonIdentifier)?.data,
    ));

    result.push(new EntityAction("create_addon", "createAddon",
      (repo : EntityRepository<Addon>) =>
        (addon : Addon) => repo.createEntity(new MetaEntity("", addon)),
    ));

    result.push(new EntityAction("get_all", "getAll",
      (repo : EntityRepository<Addon>) =>
        () => repo.readCollection().map(entity => entity?.data).filter(entity => entity),
    ));

    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  private static getEnvsActions () : EntityAction<EnvironmentVariables, EntityRepository<EnvironmentVariables>>[] {
    const result = [];

    result.push(new EntityAction("get_env", "getEnv",
      (repo : EntityRepository<EnvironmentVariables>) =>
        (envIdentifier : string) => repo.getEntity(envIdentifier)?.data,
    ));

    result.push(new EntityAction("create_env", "createEnv",
      (repo : EntityRepository<EnvironmentVariables>) =>
        (env : EnvironmentVariables) => repo.createEntity(new MetaEntity("", env)),
    ));

    result.push(new EntityAction("get_all", "getAll",
      (repo : EntityRepository<EnvironmentVariables>) =>
        () => repo.readCollection().map(entity => entity?.data).filter(entity => entity),
    ));

    return result;
  }
}
