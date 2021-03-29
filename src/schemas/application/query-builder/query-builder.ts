import { QuerySelector } from "mongodb";
import {
  PropertyQuery,
  QueryType,
  QueryTypes,
} from "@api/schemas/application/schema-bops-funtions/query-type";
import { SchemaObject, SchemasType, SchemaTypeDefinition } from "@api/configuration-de-serializer/domain/schemas-type";
import { queryTranslationMap } from "@api/schemas/application/query-builder/query-translation-type";
import { queryValueReplace } from "@api/schemas/application/query-builder/query-value-replace";

export class MongoSchemaQueryBuilder {
  private readonly schemaFormat : SchemaObject;

  public constructor (
    private readonly queryInput : QueryType,
    schema : SchemasType,
  ) {
    this.schemaFormat = schema.format;
  }

  public getFullMongoQuery () : QuerySelector<unknown> {
    const availableQueryPaths = this.getKeyTypeMap();
  }

  // eslint-disable-next-line max-lines-per-function
  private getKeyTypeMap () : Map<string, QueryTypes> {
    const propertyMap : Map<string, QueryTypes> = new Map();

    const mapSchemaProperties = (schemaFormat : SchemaObject, propertyPath ?: string) : void => {
      Object.keys(schemaFormat).forEach((key) => {
        if (schemaFormat[key].type === "object") {
          mapSchemaProperties(schemaFormat[key]["data"], key);
          return;
        }

        const mapKey = [propertyPath, key]
          .filter((value) => value !== undefined)
          .join(".");

        propertyMap.set(mapKey, this.convertSchemaTypeToQueryTypes(
          schemaFormat[key].type,
          schemaFormat[key]["data"],
        ));
      });
    };

    mapSchemaProperties(this.schemaFormat);

    return propertyMap;
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
      const query = queryValueReplace(translatedQuery, queryInput[key]);

      Object.assign(result, query);
    });

    return result;
  }

}
