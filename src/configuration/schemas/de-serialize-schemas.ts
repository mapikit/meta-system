import { isSchema } from "../assertions/schema/is-schema";
import { Schema } from "./schema";
import { SchemaType } from "./schemas-type";

export class DeserializeSchemasCommand {
  private result : Schema[] = [];
  private schemaNames : string[] = [];

  public get resultSchemas () : SchemaType[] {
    return this.result;
  };

  public constructor () {
    this.execute = this.execute.bind(this);
  }

  public execute (schemaList : unknown[]) : void {
    const foundIdentifiers : Record<string, string> = {};
    schemaList.forEach((input) => {
      isSchema(input);
      if(Object.keys(foundIdentifiers).includes(input.identifier)) {
        throw Error(`Duplicate schema identifier "${input.identifier}"\n` +
          `\t - Schemas "${input.name}" and "${foundIdentifiers[input.identifier]}" have the same identifier`);
      }
      foundIdentifiers[input.identifier] = input.name;
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
