import { QuerySelector } from "mongodb";
import {
  PropertyQuery,
  QueryType,
  QueryTypes,
  TypeStringQuery,
} from "@api/schemas/application/schema-bops-funtions/query-type";
import { SchemaObject, SchemasType, SchemaTypeDefinition } from "@api/configuration-de-serializer/domain/schemas-type";
import { queryTranslationMap } from "@api/schemas/application/query-builder/query-translation-type";

export class MongoSchemaQueryBuilder {
  private readonly schemaFormat : SchemaObject;

  public constructor (
    private readonly queryInput : QueryType,
    schema : SchemasType,
  ) {
    this.schemaFormat = schema.format;
  }

  public getFullMongoQuery () : QuerySelector<unknown> {
    
  }

  private getObjectQuery () : QuerySelector<unknown> {
    const propertyMap : Map<string, SchemaTypeDefinition["type"]> = new Map();

    Object.keys(this.schemaFormat).forEach((key) => {
      propertyMap.set(key, this.schemaFormat[key].type);
    });
  }

  // eslint-disable-next-line max-lines-per-function
  private buildStringQuery (queryInput : TypeStringQuery) : QuerySelector<string> {
    return this.buildQuery<string>(queryInput, QueryTypes.string);
  }

  // eslint-disable-next-line max-lines-per-function
  private buildQuery<T> (queryInput : PropertyQuery, type : QueryTypes) : QuerySelector<T> {
    const currentTypeQueryTranslationMap = queryTranslationMap.get(type);

    const result : QuerySelector<T> = {};

    Object.keys(queryInput).forEach((key) => {
      const translatedKey = currentTypeQueryTranslationMap.get(key as keyof TypeStringQuery);
      // Typescript throws a weird error if we try to set the property on the result object
      // so this other approach was chosen.
      const intermediaryObject : Record<string, unknown> = {};

      intermediaryObject[translatedKey] = queryInput[key];

      Object.assign(result, intermediaryObject);
    });

    return result;
  }

}
