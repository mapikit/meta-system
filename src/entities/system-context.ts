import { ConfigurationType } from "../configuration/configuration-type.js";
import { EntityValue, MetaEntity } from "./meta-entity.js";
import { BusinessOperation } from "../configuration/business-operations/business-operation.js";
import { Schema } from "../configuration/schemas/schema.js";
import { Addon } from "../configuration/addons/addon-type.js";
import { BrokerFactory, EntityBroker } from "../broker/entity-broker.js";
import constants from "../common/constants.js";
import { EntityRepository } from "./repository.js";

type EnvironmentVariables = EntityValue & {
  value : string;
};

export class SystemContext {
  private readonly envs : MetaEntity<EnvironmentVariables>[]= [];
  private readonly schemas : MetaEntity<Schema>[] = [];
  private readonly businessOperations : MetaEntity<BusinessOperation>[] = [];
  private readonly addons : MetaEntity<Addon>[] = [];
  public readonly systemConfig : ConfigurationType;

  public readonly broker : EntityBroker;

  // eslint-disable-next-line max-lines-per-function
  public constructor (options : {
    systemConfig : ConfigurationType;
  }) {
    this.systemConfig = options.systemConfig;

    const factory = new BrokerFactory();
    this.broker = factory
      .useEntity({ entity: "schema", permissions: [constants.PERMISSION_OVERRIDE_VALUE] },
        new EntityRepository(this.schemas))
      .useEntity({ entity: "businessOperation", permissions: [constants.PERMISSION_OVERRIDE_VALUE] },
        new EntityRepository(this.businessOperations))
      .useEntity({ entity: "env", permissions: [constants.PERMISSION_OVERRIDE_VALUE] },
        new EntityRepository(this.envs))
      .useEntity({ entity: "addon", permissions: [constants.PERMISSION_OVERRIDE_VALUE] },
        new EntityRepository(this.addons))
      .build();
  }
}
