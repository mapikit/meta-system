import { SchemaObject } from "@api/configuration-de-serializer/domain/schemas-type";
import { FilterQuery } from "mongodb";

export class QueryParser {
  // eslint-disable-next-line max-lines-per-function
  public static parseQuery<T> (
    query : FilterQuery<T>,
    schemaFormat : SchemaObject,
  ) : FilterQuery<T> {
    const resolved : FilterQuery<object> = {};
    for(const propInSchema in schemaFormat) {
      if(query[propInSchema]) {
        if(schemaFormat[propInSchema].type == "object" && typeof query[propInSchema] == "object") {
          resolved[propInSchema] = this.parseQuery(query[propInSchema], schemaFormat[propInSchema]["data"]);
        }
        else if(schemaFormat[propInSchema].type == "array" && query[propInSchema] instanceof Array) {
          resolved[propInSchema] = [];
          for(const prop of query[propInSchema]) {
            resolved[propInSchema].push(this.resolveBasicType(prop, schemaFormat[propInSchema]["data"]));
          }
        }
        else {
          resolved[propInSchema] = this.resolveBasicType(query[propInSchema], schemaFormat[propInSchema].type);
        }
      }
    }
    return resolved;
  }

  private static resolveBasicType (query : string, type : string) : string | number | boolean {
    if(type == "string") {
      return query;
    }
    else if(type == "number" && typeof Number(query == "number")) {
      return Number(query);
    }
    else if(type == "boolean" && ["true", "false"].includes(query)) {
      return Boolean(query);
    }
    return;
  }
}
