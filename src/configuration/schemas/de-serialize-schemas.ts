import { SchemasType } from "@api/configuration/schemas/schemas-type";
import { isSchema } from "@api/configuration/assertions/schema/is-schema";
import { Schema } from "@api/configuration/schemas/schema";

export class DeserializeSchemasCommand {
  private result : Schema[] = [];
  private schemaNames : string[] = [];

  public get resultSchemas () : SchemasType[] {
    return this.result;
  };

  public constructor () {
    this.execute = this.execute.bind(this);
  }

  public execute (schemaList : unknown[]) : void {
    schemaList.forEach((input) => {
      isSchema(input);
      this.result.push(new Schema(input));
      this.schemaNames.push(input.name);
    });

    this.validateSchemaRefs();
  }

  private validateSchemaRefs () : void {
    const schemaRefs : string[] = [];

    this.result.forEach((schema) => {
      schemaRefs.push(...Schema.findRefs(schema.format));
    });

    schemaRefs.forEach((refName) => {
      const foundSchema = this.result.find((schema) => {
        return schema.name === refName;
      });

      if (foundSchema === undefined) {
        throw new Error(
          "Schema Configuration Error: 'Schema with unmatched refName found - Be sure that all refNames exists!'");
      }
    });
  }
};
