import { ProtocolFunctionManagerClass } from "../../bops-functions/function-managers/protocol-function-manager";
import { assertsDbProtocol } from "../../configuration/protocols/is-db-protocol";
import { SchemaType } from "../../configuration/schemas/schemas-type";
import { logger } from "../../common/logger/logger";
import { SchemaManager } from "./schema-manager";

export class SchemasManager {
  private readonly systemName : string;
  public schemas : Map<string, SchemaManager> = new Map();
  private readonly protocolsManager : ProtocolFunctionManagerClass;

  constructor (systemName : string, protocolFunctionManager : ProtocolFunctionManagerClass) {
    this.systemName = systemName;
    this.protocolsManager = protocolFunctionManager;
  }

  private async addSchema (schema : SchemaType) : Promise<void> {
    logger.operation(`[Schemas] Adding Schema "${schema.name}" - DB protocol "${schema.dbProtocol}"`);
    const dbProtocol = this.protocolsManager.getProtocolInstance(schema.dbProtocol);
    if(dbProtocol === undefined) {
      throw Error(`No db protocol registered as "${schema.dbProtocol}". ` +
      `Available are: ${this.protocolsManager.getAvailableDbProtocols().join(", ")}`);
    }
    assertsDbProtocol(dbProtocol, " - Could not add protocol to schema!");

    await this.protocolsManager.initializeDbProtocol(schema.dbProtocol);

    const schemaManager = new SchemaManager({
      schema, dbProtocol, systemName: this.systemName,
    });

    this.schemas.set(schema.name, schemaManager);
  }

  public async addSystemSchemas (systemSchemas : SchemaType[]) : Promise<void> {
    for (const schema of systemSchemas) {
      await this.addSchema(schema)
        .then(async () => {
          logger.success(`[Schemas] Schema "${schema.name}" successfully added`);
        })
        .catch(err => {
          logger.error(`[Schemas] Error while adding schema "${schema.name}"`);
          logger.error(err);
        });
    }
  }
}
