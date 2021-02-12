import { SchemaObject } from "@api/configuration-de-serializer/domain/schemas-type";
import { FilterQuery } from "mongodb";

export function  parseQuery<T> (query : FilterQuery<T>, schema : SchemaObject) : FilterQuery<T> {
  const resolved : FilterQuery<object> = {};
  for(const property in query) {
    if(schema[property]) {
      resolved[property] = TypeResolver[schema[property].type](query[property], schema[property]["data"]);
    }
  }
  return resolved;
}

class TypeResolver {
  static string (query : string) : string { return query; };
  static number (query : string) : number { return Number(query); };
  static boolean (query : string) : boolean { return query === "true"; };
  static date (query : string) : Date { return new Date(query); };
  static object (query : unknown, dataFormat : SchemaObject) : object {
    if(typeof query === "object") return parseQuery(query, dataFormat);
  };

  static array (query : unknown, dataFormat : string) : Array<unknown> {
    if(query instanceof Array) {
      const array = [];
      const dataType = typeof dataFormat == "string" ? dataFormat : "object";
      query.forEach(property => {
        array.push(TypeResolver[dataType](property));
      });
      return array;
    }
  };
};
