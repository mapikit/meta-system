import { FilterQuery, QuerySelector } from "mongodb";
import {
  PropertyQuery,
  QueryType,
  QueryTypes,
} from "@api/schemas/application/schema-bops-funtions/query-type";
import { SchemaObject, SchemasType, SchemaTypeDefinition } from "@api/configuration/schemas/schemas-type";
import { queryTranslationMap } from "@api/schemas/application/query-builder/query-translation-type";
import { queryValueReplace } from "@api/schemas/application/query-builder/query-value-replace";
import { getObjectProperty } from "./get-object-property";

export class MongoSchemaQueryBuilder {
  private readonly schemaFormat : SchemaObject;
  private readonly availableQueryPaths : Map<string, QueryTypes> = new Map();

  public constructor (
    private readonly queryInput : QueryType,
    schema : SchemasType,
  ) {
    this.schemaFormat = schema.format;

    this.getKeyTypeMap();
  }

  public getFullMongoQuery () : FilterQuery<unknown> {
    const result : Record<string, QuerySelector<unknown>> = {};

    this.availableQueryPaths.forEach((type, propertyPath) => {
      const propertyQuery = getObjectProperty<PropertyQuery>(this.queryInput, propertyPath);
      if (propertyQuery === undefined) return;

      const query = this.buildQuery(propertyQuery, type);

      this.assignQueryToResult(result, query, propertyPath);
    });

    return result;
  }

  private assignQueryToResult (
    result : QuerySelector<unknown>,
    query : QuerySelector<unknown>,
    atPath : string,
  ) : QuerySelector<unknown> {
    const resultingQuery = {};
    resultingQuery[atPath] = query;

    Object.assign(result, resultingQuery);

    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  private getKeyTypeMap () : void {
    const mapSchemaProperties = (schemaFormat : SchemaObject, propertyPath ?: string) : void => {
      Object.keys(schemaFormat).forEach((key) => {
        if (schemaFormat[key].type === "object") {
          mapSchemaProperties(schemaFormat[key]["data"], key);
          return;
        }

        const mapKey = [propertyPath, key]
          .filter((value) => value !== undefined)
          .join(".");

        this.availableQueryPaths.set(mapKey, this.convertSchemaTypeToQueryTypes(
          schemaFormat[key].type,
          schemaFormat[key]["data"],
        ));
      });
    };

    mapSchemaProperties(this.schemaFormat);
  }

  // eslint-disable-next-line max-lines-per-function
  private convertSchemaTypeToQueryTypes (type : SchemaTypeDefinition["type"], data ?: string | object) : QueryTypes {
    const typeConversionMap = {
      "number": QueryTypes.number,
      "string": QueryTypes.string,
      "boolean": QueryTypes.booleanArray,
      "date": QueryTypes.date,
      "object": QueryTypes.object,
      "array.number": QueryTypes.numberArray,
      "array.string": QueryTypes.stringArray,
      "array.boolean": QueryTypes.booleanArray,
      "array.date": QueryTypes.dateArray,
      "array.object": QueryTypes.objectArray,
    };

    const dataValue = (typeof data === "object" ? "object" : data) ?? "";

    const typeValue = type === "array" ?
      `array.${dataValue}` : type;

    return typeConversionMap[typeValue];
  }

  private buildQuery<T> (queryInput : PropertyQuery, type : QueryTypes) : QuerySelector<T> {
    const currentTypeQueryTranslationMap = queryTranslationMap.get(type);

    const result : QuerySelector<T> = {};

    Object.keys(queryInput).forEach((key) => {
      const translatedQuery = currentTypeQueryTranslationMap.get(key);
      if (translatedQuery === undefined) {
        throw Error("[Schemas] Failed to build a query due to having an unknown query key");
      }

      const query = queryValueReplace(translatedQuery, queryInput[key]);

      Object.assign(result, query);
    });

    return result;
  }
}
