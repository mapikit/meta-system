import { ConfigurationType, EnvironmentVariable } from "../configuration/configuration-type.js";
import { EntityValue, MetaEntity } from "./meta-entity.js";
import { BusinessOperation as BusinessOperationClass }
  from "../configuration/business-operations/business-operation.js";
import { Schema as SchemaClass } from "../configuration/schemas/schema.js";
import { Addon } from "../configuration/addon-type.js";
import { BrokerFactory, EntityBroker, EntityPermissions } from "../broker/entity-broker.js";
import constants from "../common/constants.js";
import { EntityRepository } from "./repository.js";
import { EntityAction } from "./entity-action.js";
import { DiffManager } from "../configuration/diff/diff-manager.js";
import { checkEntityDiff } from "../configuration/diff/check-entity-diff.js";

export type EnvironmentVariableEntity = EntityValue & EnvironmentVariable;
type Schema = Pick<SchemaClass, "format" | "identifier" | "name">;
type BusinessOperation = Pick<BusinessOperationClass,
"configuration" | "constants" | "identifier" | "input" | "output" | "ttl" | "variables">;

export class SystemContext {
  private readonly envs : MetaEntity<EnvironmentVariableEntity>[]= [];
  private readonly schemas : MetaEntity<Schema>[] = [];
  private readonly businessOperations : MetaEntity<BusinessOperation>[] = [];
  private readonly addons : MetaEntity<Addon>[] = [];

  public readonly systemConfig : ConfigurationType;
  public readonly systemBroker : EntityBroker;

  // eslint-disable-next-line max-lines-per-function
  public constructor (systemConfig : ConfigurationType, private diffManager : DiffManager) {
    this.systemConfig = systemConfig;

    this.businessOperations = systemConfig.businessOperations
      .map(bop => new MetaEntity(constants.ENGINE_OWNER, bop));
    this.addons = systemConfig.addons.map(addon => new MetaEntity(constants.ENGINE_OWNER, addon));
    this.schemas = systemConfig.schemas.map(schema => new MetaEntity(constants.ENGINE_OWNER, schema));
    this.envs = systemConfig.envs.map(env => new MetaEntity(constants.ENGINE_OWNER, { identifier: env.key, ...env }));

    const factory = new BrokerFactory();
    this.systemBroker = factory
      .configEntity("schemas", this.getSchemasActions(constants.RUNTIME_ENGINE_IDENTIFIER),
        new EntityRepository(this.schemas))
      .useEntity({ entity: "schemas", permissions: [constants.PERMISSION_OVERRIDE_VALUE] },
        new EntityRepository(this.schemas))
      .configEntity("businessOperations", this.getBopsActions(constants.RUNTIME_ENGINE_IDENTIFIER),
        new EntityRepository(this.businessOperations))
      .useEntity({ entity: "businessOperations", permissions: [constants.PERMISSION_OVERRIDE_VALUE] })
      .configEntity("envs", this.getEnvsActions(constants.RUNTIME_ENGINE_IDENTIFIER),
        new EntityRepository(this.envs))
      .useEntity({ entity: "envs", permissions: [constants.PERMISSION_OVERRIDE_VALUE] })
      .configEntity("addons", this.getAddonsActions(constants.RUNTIME_ENGINE_IDENTIFIER),
        new EntityRepository(this.addons))
      .useEntity({ entity: "addons", permissions: [constants.PERMISSION_OVERRIDE_VALUE] })
      .build();
  }

  // eslint-disable-next-line max-lines-per-function
  public getBopsActions (identifier : string)
    : EntityAction<BusinessOperation, EntityRepository<BusinessOperation>>[] {
    const result = [];

    result.push(new EntityAction("get_bop", "getBop",
      (repo : EntityRepository<BusinessOperation>) =>
        (bopIdentifier : string) => repo.getEntity(bopIdentifier)?.data,
      true));

    result.push(new EntityAction("create_bop", "createBop",
      (repo : EntityRepository<BusinessOperation>) =>
        (bop : BusinessOperation) => {
          const created = new MetaEntity(identifier, bop);
          repo.createEntity(created);

          this.diffManager.addManyDiffsFromCheck(
            checkEntityDiff(bop.identifier, identifier, "businessOperations", {}, created.data),
          );
        },
    ));

    result.push(new EntityAction("get_all", "getAll",
      (repo : EntityRepository<BusinessOperation>) =>
        () => repo.readCollection().map(entity => entity?.data).filter(entity => entity),
      true));

    return result;
  }


  // eslint-disable-next-line max-lines-per-function
  public getSchemasActions (identifier : string)
    : EntityAction<Schema, EntityRepository<Schema>>[] {
    const result = [];

    result.push(new EntityAction("get_schema", "getSchema",
      (repo : EntityRepository<Schema>) =>
        (schemaIdentifier : string) => repo.getEntity(schemaIdentifier)?.data,
      true));

    result.push(new EntityAction("create_schema", "createSchema",
      (repo : EntityRepository<Schema>) =>
        (schema : Schema) => {
          const newEntity = new MetaEntity(identifier, schema);
          repo.createEntity(newEntity);

          this.diffManager.addManyDiffsFromCheck(
            checkEntityDiff(schema.identifier, identifier, "schema", {}, newEntity.data),
          );
        },
    ));

    result.push(new EntityAction("get_all", "getAll",
      (repo : EntityRepository<Schema>) =>
        () => repo.readCollection().map(entity => entity?.data).filter(entity => entity),
      true));

    result.push(new EntityAction("modify_schema", "modifySchema",
      (repo : EntityRepository<Schema>) =>
        (schema : Schema) => {
          const modified = new MetaEntity(identifier, schema);
          const old = repo.getEntity(schema.identifier).data;
          repo.updateEntity(modified);

          this.diffManager.addManyDiffsFromCheck(
            checkEntityDiff(schema.identifier, identifier, "schema", old, modified.data),
          );
        }));

    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  public getAddonsActions (identifier : string) : EntityAction<Addon, EntityRepository<Addon>>[] {
    const result = [];

    result.push(new EntityAction("get_addon", "getAddon",
      (repo : EntityRepository<Addon>) =>
        (addonIdentifier : string) => repo.getEntity(addonIdentifier)?.data,
      true));

    result.push(new EntityAction("create_addon", "createAddon",
      (repo : EntityRepository<Addon>) =>
        (addon : Addon) => repo.createEntity(new MetaEntity(identifier, addon)),
    ));

    result.push(new EntityAction("get_all", "getAll",
      (repo : EntityRepository<Addon>) =>
        () => repo.readCollection().map(entity => entity?.data).filter(entity => entity),
      true));

    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  public getEnvsActions (identifier : string)
    : EntityAction<EnvironmentVariableEntity, EntityRepository<EnvironmentVariableEntity>>[] {
    const result = [];

    result.push(new EntityAction("get_env", "getEnv",
      (repo : EntityRepository<EnvironmentVariableEntity>) =>
        (envKey : string) => repo.getEntity(envKey)?.data,
      true));

    result.push(new EntityAction("create_env", "createEnv",
      (repo : EntityRepository<EnvironmentVariableEntity>) =>
        (env : EnvironmentVariable) => {
          const created = new MetaEntity(identifier, { identifier: env.key, ...env });
          repo.createEntity(created);

          this.diffManager.addManyDiffsFromCheck(
            checkEntityDiff(env.key, identifier, "envs", {}, created.data),
          );
        },
    ));

    result.push(new EntityAction("get_all", "getAll",
      (repo : EntityRepository<EnvironmentVariableEntity>) =>
        () => repo.readCollection().map(entity => entity?.data).filter(entity => entity),
      true));

    return result;
  }

  public createBroker (accesses : EntityPermissions[], identifier : string) : EntityBroker {
    const factory = new BrokerFactory()
      .configEntity("schemas", this.getSchemasActions(identifier),
        new EntityRepository(this.schemas))
      .configEntity("businessOperations", this.getBopsActions(identifier),
        new EntityRepository(this.businessOperations))
      .configEntity("envs", this.getEnvsActions(identifier),
        new EntityRepository(this.envs))
      .configEntity("addons", this.getAddonsActions(identifier),
        new EntityRepository(this.addons));

    accesses.forEach((access) => {
      factory.useEntity(access);
    });

    return factory.build();
  }
}
