import { ProtocolFunctionManagerClass } from "bops-functions/function-managers/protocol-function-manager";
import { assertsDbProtocol } from "configuration/protocols/is-db-protocol";
import { SchemaType } from "../../configuration/schemas/schemas-type";
import { SchemaManager } from "./schema-manager";

export class SchemasManager {
  private readonly systemName : string;
  public schemas : Map<string, SchemaManager> = new Map();
  private protocolsManager : ProtocolFunctionManagerClass;

  constructor (systemName : string, protocolFunctionManager : ProtocolFunctionManagerClass) {
    this.systemName = systemName;
    this.protocolsManager = protocolFunctionManager;
  }

  private async addSchema (schema : SchemaType) : Promise<void> {
    console.log(`[Schemas] Adding Schema "${schema.name}" - DB protocol "${schema.dbProtocol}"`);
    const dbProtocol = this.protocolsManager.getProtocolInstance(schema.dbProtocol);
    assertsDbProtocol(dbProtocol);

    await dbProtocol.initialize();

    const schemaManager = new SchemaManager({
      schema, dbProtocol, systemName: this.systemName,
    });

    this.schemas.set(schema.name, schemaManager);
  }

  public async addSystemSchemas (systemSchemas : SchemaType[]) : Promise<void> {
    for (const schema of systemSchemas) {
      await this.addSchema(schema)
        .then(async () => {
          console.log(`[Schemas] Schema "${schema.name}" successfully added`);
        })
        .catch(err => {
          console.log(`[Schemas] Error while adding schema "${schema.name}"`);
          console.log(err);
        });
    }
  }
}
