import { DBProtocol } from "@meta-system/meta-protocol-helper";
import { SchemaType } from "../../configuration/schemas/schemas-type";
import { SchemasFunctions } from "../domain/schemas-functions";

type SchemasFunctionsTypes = {
  [key in SchemasFunctions] : Function;
}

export class SchemasBopsFunctions implements SchemasFunctionsTypes {
  private readonly dbProtocol : DBProtocol<unknown>;
  private workingSchema : SchemaType;

  public insert : (input : unknown) => Promise<unknown>
  public findById : (input : unknown) => Promise<unknown>
  public find : (input : unknown) => Promise<unknown>
  public update : (input : unknown) => Promise<unknown>
  public updateById : (input : unknown) => Promise<unknown>
  public delete : (input : unknown) => Promise<unknown>
  public deleteById : (input : unknown) => Promise<unknown>
  public count : (input : unknown) => Promise<unknown>

  public constructor (dbProtocol : DBProtocol<unknown>) {
    this.dbProtocol = dbProtocol;

    this.wrapWithIdentifier = this.wrapWithIdentifier.bind(this);

    this.insert = this.wrapWithIdentifier(this.dbProtocol.insert);
    this.findById = this.wrapWithIdentifier(this.dbProtocol.findById);
    this.find = this.wrapWithIdentifier(this.dbProtocol.find);
    this.update = this.wrapWithIdentifier(this.dbProtocol.update);
    this.updateById = this.wrapWithIdentifier(this.dbProtocol.updateById);
    this.delete = this.wrapWithIdentifier(this.dbProtocol.delete);
    this.deleteById = this.wrapWithIdentifier(this.dbProtocol.deleteById);
    this.count = this.wrapWithIdentifier(this.dbProtocol.count);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private wrapWithIdentifier (dbFunction : Function) : (input : any) => Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (input : any) : Promise<any> => dbFunction(this.workingSchema.identifier, input);
  }

  public set schema (schemaType : SchemaType) {
    this.workingSchema = schemaType;
  }
};
