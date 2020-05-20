import { Procedure } from "birbs";
import { logger } from "@api/mapikit/logger/logger";
import { SchemaContext } from "@api/entity/domain/contexts/schema-context";
import { FailureResponseCodes } from "@api/common/enums/fail-response-codes";
import { ResponseMessages } from "@api/common/enums/response-messages";
import { SchemaField } from "@api/entity/domain/types/schema-field";
import Http from "http-status-codes";
import { InsertEntityResponse } from "@api/entity/domain/types/responses/response-payloads";
import { Entity } from "@api/entity/domain/models/entity";
import { EntityInsertionPayload } from "@api/entity/domain/payloads/entity-insertion-payload";
import { ClientRepository } from "@api/client/domain/repositories/client-repository";
import { SchemaRepository } from "@api/entity/domain/repositories/schema-repository";
import { MongoRepositoryAttributes } from "@api/entity/domain/repositories/mongo-repository";

interface InsertEntityParameters { payload : EntityInsertionPayload; identifier : symbol }

export class InsertEntity extends Procedure {
  public clientRepository : ClientRepository;
  public schemaRepository : SchemaRepository;
  public mongoRepository : MongoRepositoryAttributes;

  constructor (repositories : {
    ClientRepository : ClientRepository;
    SchemaRepository : SchemaRepository;
    MongoRepository : MongoRepositoryAttributes;
  }) {
    super({ lifetime: "SINGLE" });
    this.clientRepository = repositories.ClientRepository;
    this.schemaRepository = repositories.SchemaRepository;
    this.mongoRepository = repositories.MongoRepository;
  }

  // eslint-disable-next-line max-lines-per-function
  public async execute (context : SchemaContext, parameters ?: InsertEntityParameters) : Promise<void> {
    const relatedSchema = await this.schemaRepository.findById(parameters.payload.schemaId);
    if(!relatedSchema) {
      this.invalidSchemaId(context);

      return;
    }

    if(relatedSchema.clientId !== context.contextState.clientId) {
      this.invalidClientId(context);

      return;
    }

    if(!this.isValidType(parameters.payload.entity, relatedSchema.schema)) {
      this.invalidType(context);

      return;
    }
    const entity = Entity.toDomain(parameters.payload.entity);
    await this.mongoRepository.checkoutDatabase(context.contextState.clientName);
    await this.mongoRepository.selectCollection(relatedSchema.schemaId);
    await this.mongoRepository.insert(entity);

    context.setResponse<InsertEntityResponse>({ data : { Entity : entity }, statusCode: 201 });
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

  private invalidClientId (context : SchemaContext) : void {
    context.setError({
      key: FailureResponseCodes.invalidClientId,
      message: ResponseMessages.invalidClientId,
      statusCode: Http.NOT_FOUND,
    });
  }

  private invalidSchemaId (context : SchemaContext) : void {
    context.setError({
      key: FailureResponseCodes.invalidSchemaId,
      message: ResponseMessages.invalidSchemaId,
      statusCode: Http.NOT_FOUND,
    });
  }

  private invalidType (context : SchemaContext) : void {
    context.setError({
      key: FailureResponseCodes.schemaTypeMismatch,
      message: ResponseMessages.schemaTypeMismatch,
      statusCode: Http.BAD_REQUEST,
    });
  }
}
