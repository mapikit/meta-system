import { Procedure } from "birbs";
import { logger } from "@api/mapikit/logger/logger";
import { FailureResponseCodes } from "@api/common/enums/fail-response-codes";
import { ResponseMessages } from "@api/common/enums/response-messages";
import Http from "http-status-codes";
import { InsertEntityResponse } from "@api/entity/domain/types/responses/response-payloads";
import { Entity } from "@api/entity/domain/models/entity";
import { EntityInsertionPayload } from "@api/entity/domain/payloads/entity-insertion-payload";
import { MongoRepositoryAttributes } from "@api/entity/domain/repositories/mongo-repository";
import { EntityContext } from "@api/entity/domain/contexts/entity-context";
import { SchemaField } from "@api/entity/domain/types/schema-field-attributes";

interface InsertEntityParameters { payload : EntityInsertionPayload; identifier : symbol }

export class InsertEntity extends Procedure {
  public mongoRepository : MongoRepositoryAttributes;

  constructor (options : {
    MongoRepository : MongoRepositoryAttributes;
  }) {
    super({ lifetime: "SINGLE" });
    this.mongoRepository = options.MongoRepository;
  }

  //TODO REMOVE THIS DISABLE
  // eslint-disable-next-line max-lines-per-function
  public async execute (context : EntityContext, parameters ?: InsertEntityParameters) : Promise<void> {
    logger.debug({ message: "Starting Enitty Insertion Procedure", contextState: context.contextState });

    if(!context.contextState.clientName) {
      this.invalidRequest(context);

      return;
    }

    if(parameters.payload.schema.clientId !== context.contextState.clientId) {
      this.invalidClientId(context);

      return;
    }

    if(!this.isValidType(parameters.payload.entity, parameters.payload.schema.schema)) {
      this.invalidType(context);

      return;
    }

    const entity = Entity.toDomain(parameters.payload.entity);
    await this.mongoRepository.checkoutDatabase(context.contextState.clientName);
    await this.mongoRepository.selectCollection(parameters.payload.schema.schemaId);
    await this.mongoRepository.insert(entity);

    context.setResponse<InsertEntityResponse>({ data : { message : "Inserted" }, statusCode: 201 });
    logger.debug({ message: `New entity ${entity} added` });
  }

  private isValidType (entity : Entity, schemaFields : SchemaField[]) : boolean {
    const keys = Object.keys(entity).filter((key) => {
      if(key !== "updatedAt" && key !== "createdAt") {
        return key;
      }
    });
    for(const key of keys) {
      const fieldInQuestion = schemaFields.find((field) => field.fieldName === key);
      if(!this.checkFieldType(entity, fieldInQuestion, key)) {

        return false;
      }
    };

    return true;
  }

  private checkFieldType (entity : Entity, schemaField : SchemaField, key : string) : boolean {
    if(schemaField.fieldType !== typeof entity[key] && !schemaField.nullable) {

      return false;
    }
    if(schemaField.nullable && entity[key] != undefined && schemaField.fieldType !== typeof entity[key]) {

      return false;
    }

    return true;
  }

  //For future use
  private async validateUniqueKeys (entity : Entity, uniqueKeys : string[]) : Promise<boolean> {
    for (const key of uniqueKeys) {
      if (await this.mongoRepository.query({ [key]: entity[key] })) {
        return false;
      }
    }

    return true;
  }


  private invalidRequest (context : EntityContext) : void {
    context.setError({
      key: FailureResponseCodes.invalidRequest,
      message: ResponseMessages.invalidRequest,
      statusCode: Http.BAD_REQUEST,
    });
  }

  private invalidClientId (context : EntityContext) : void {
    context.setError({
      key: FailureResponseCodes.invalidClientId,
      message: ResponseMessages.invalidClientId,
      statusCode: Http.NOT_FOUND,
    });
  }

  private invalidType (context : EntityContext) : void {
    context.setError({
      key: FailureResponseCodes.schemaTypeMismatch,
      message: ResponseMessages.schemaTypeMismatch,
      statusCode: Http.BAD_REQUEST,
    });
  }
}
