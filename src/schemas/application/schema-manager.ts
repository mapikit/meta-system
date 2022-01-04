import { DBProtocol } from "@meta-system/meta-protocol-helper";
import { SchemaType } from "../../configuration/schemas/schemas-type";
import { SchemasBopsFunctions } from "./schema-bops-functions";

export class SchemaManager {
  public bopsFunctions : SchemasBopsFunctions;

  public constructor (options : {
    schema : SchemaType;
    dbProtocol : DBProtocol<unknown>;
    systemName : string;
  }) {

    this.bopsFunctions = new SchemasBopsFunctions(options.dbProtocol);
    this.bopsFunctions.schema = options.schema;
  }
}
