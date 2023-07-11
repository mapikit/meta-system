import { ConfigurationType, EnvironmentVariable } from "../configuration/configuration-type.js";
import { EntityValue, MetaEntity } from "./meta-entity.js";
import { BusinessOperation } from "../configuration/business-operations/business-operation.js";
import { Schema } from "../configuration/schemas/schema.js";
import { Addon } from "../configuration/addon-type.js";
import { BrokerFactory, EntityBroker, EntityPermissions } from "../broker/entity-broker.js";
import constants from "../common/constants.js";
import { EntityRepository } from "./repository.js";
import { EntityAction } from "./entity-action.js";

type EnvironmentVariableEntity = EntityValue & EnvironmentVariable;

export class SystemContext {
  private readonly envs : MetaEntity<EnvironmentVariableEntity>[]= [];
  private readonly schemas : MetaEntity<Schema>[] = [];
  private readonly businessOperations : MetaEntity<BusinessOperation>[] = [];
  private readonly addons : MetaEntity<Addon>[] = [];

  public readonly systemConfig : ConfigurationType;
  public readonly systemBroker : EntityBroker;

  // eslint-disable-next-line max-lines-per-function
  public constructor (systemConfig : ConfigurationType) {
    this.systemConfig = systemConfig;

    this.businessOperations = systemConfig.businessOperations
      .map(bop => new MetaEntity(constants.ENGINE_OWNER, bop));
    this.addons = systemConfig.addons.map(addon => new MetaEntity(constants.ENGINE_OWNER, addon));
    this.schemas = systemConfig.schemas.map(schema => new MetaEntity(constants.ENGINE_OWNER, schema));
    this.envs = systemConfig.envs.map(env => new MetaEntity(constants.ENGINE_OWNER, { identifier: env.key, ...env }));

    const factory = new BrokerFactory();
    this.systemBroker = factory
      .configEntity("schemas", SystemContext.getSchemasActions(constants.RUNTIME_ENGINE_IDENTIFIER),
        new EntityRepository(this.schemas))
      .useEntity({ entity: "schemas", permissions: [constants.PERMISSION_OVERRIDE_VALUE] },
        new EntityRepository(this.schemas))
      .configEntity("businessOperations", SystemContext.getBopsActions(constants.RUNTIME_ENGINE_IDENTIFIER),
        new EntityRepository(this.businessOperations))
      .useEntity({ entity: "businessOperations", permissions: [constants.PERMISSION_OVERRIDE_VALUE] })
      .configEntity("envs", SystemContext.getEnvsActions(constants.RUNTIME_ENGINE_IDENTIFIER),
        new EntityRepository(this.envs))
      .useEntity({ entity: "envs", permissions: [constants.PERMISSION_OVERRIDE_VALUE] })
      .configEntity("addons", SystemContext.getAddonsActions(constants.RUNTIME_ENGINE_IDENTIFIER),
        new EntityRepository(this.addons))
      .useEntity({ entity: "addons", permissions: [constants.PERMISSION_OVERRIDE_VALUE] })
      .build();
  }

  // eslint-disable-next-line max-lines-per-function
  private static getBopsActions (identifier : string)
    : EntityAction<BusinessOperation, EntityRepository<BusinessOperation>>[] {
    const result = [];

    result.push(new EntityAction("get_bop", "getBop",
      (repo : EntityRepository<BusinessOperation>) =>
        (bopIdentifier : string) => repo.getEntity(bopIdentifier)?.data,
    ));

    result.push(new EntityAction("create_bop", "createBop",
      (repo : EntityRepository<BusinessOperation>) =>
        (bop : BusinessOperation) => repo.createEntity(new MetaEntity(identifier, bop)),
    ));

    result.push(new EntityAction("get_all", "getAll",
      (repo : EntityRepository<BusinessOperation>) =>
        () => repo.readCollection().map(entity => entity?.data).filter(entity => entity),
    ));

    return result;
  }


  // eslint-disable-next-line max-lines-per-function
  private static getSchemasActions (identifier : string)
    : EntityAction<Schema, EntityRepository<Schema>>[] {
    const result = [];

    result.push(new EntityAction("get_schema", "getSchema",
      (repo : EntityRepository<Schema>) =>
        (schemaIdentifier : string) => repo.getEntity(schemaIdentifier)?.data,
      true));

    result.push(new EntityAction("create_schema", "createSchema",
      (repo : EntityRepository<Schema>) =>
        (schema : Schema) => repo.createEntity(new MetaEntity(identifier, schema)),
    ));

    result.push(new EntityAction("get_all", "getAll",
      (repo : EntityRepository<Schema>) =>
        () => repo.readCollection().map(entity => entity?.data).filter(entity => entity),
      true));

    result.push(new EntityAction("modify_schema", "modifySchema",
      (repo : EntityRepository<Schema>) =>
        (schema : Schema) => {
          repo.updateEntity(new MetaEntity(identifier, schema));
        }));

    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  private static getAddonsActions (identifier : string) : EntityAction<Addon, EntityRepository<Addon>>[] {
    const result = [];

    result.push(new EntityAction("get_addon", "getAddon",
      (repo : EntityRepository<Addon>) =>
        (addonIdentifier : string) => repo.getEntity(addonIdentifier)?.data,
    ));

    result.push(new EntityAction("create_addon", "createAddon",
      (repo : EntityRepository<Addon>) =>
        (addon : Addon) => repo.createEntity(new MetaEntity(identifier, addon)),
    ));

    result.push(new EntityAction("get_all", "getAll",
      (repo : EntityRepository<Addon>) =>
        () => repo.readCollection().map(entity => entity?.data).filter(entity => entity),
    ));

    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  private static getEnvsActions (identifier : string)
    : EntityAction<EnvironmentVariableEntity, EntityRepository<EnvironmentVariableEntity>>[] {
    const result = [];

    result.push(new EntityAction("get_env", "getEnv",
      (repo : EntityRepository<EnvironmentVariableEntity>) =>
        (envIdentifier : string) => repo.getEntity(envIdentifier)?.data,
    ));

    result.push(new EntityAction("create_env", "createEnv",
      (repo : EntityRepository<EnvironmentVariableEntity>) =>
        (env : EnvironmentVariableEntity) => repo.createEntity(new MetaEntity(identifier, env)),
    ));

    result.push(new EntityAction("get_all", "getAll",
      (repo : EntityRepository<EnvironmentVariableEntity>) =>
        () => repo.readCollection().map(entity => entity?.data).filter(entity => entity),
    ));

    return result;
  }

  public createBroker (accesses : EntityPermissions[], identifier : string) : EntityBroker {
    const factory = new BrokerFactory()
      .configEntity("schemas", SystemContext.getSchemasActions(identifier),
        new EntityRepository(this.schemas))
      .configEntity("businessOperations", SystemContext.getBopsActions(identifier),
        new EntityRepository(this.businessOperations))
      .configEntity("envs", SystemContext.getEnvsActions(identifier),
        new EntityRepository(this.envs))
      .configEntity("addons", SystemContext.getAddonsActions(identifier),
        new EntityRepository(this.addons));

    accesses.forEach((access) => {
      factory.useEntity(access);
    });

    return factory.build();
  }
}
