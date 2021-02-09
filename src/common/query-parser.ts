import { SchemaObject } from "@api/configuration-de-serializer/domain/schemas-type";
import { FilterQuery } from "mongodb";

type TypeResolver = {[typeName : string] : (query : string | unknown, dataFormat ?: SchemaObject | string) => unknown}

export function  parseQuery<T> (query : FilterQuery<T>, schema : SchemaObject) : FilterQuery<T> {
  const resolved : FilterQuery<object> = {};
  for(const property in query) {
    if(schema[property]) {
      resolved[property] = resolveType[schema[property].type](query[property], schema[property]["data"]);
    }
  }
  return resolved;
}

const resolveType : TypeResolver = {
  string: (query : string) : string =>  query,
  number: (query : string) : number => Number(query),
  boolean: (query : string) : boolean => query === "true",
  date : (query : string) : Date => new Date(query),
  object: (query : unknown, dataFormat : SchemaObject) : object => {
    if(typeof query === "object") return parseQuery(query, dataFormat);
  },
  array: (query : unknown, dataFormat : string) : Array<unknown> => {
    if(query instanceof Array) {
      const array = [];
      const dataType = typeof dataFormat == "string" ? dataFormat : "object";
      query.forEach(property => {
        array.push(resolveType[dataType](property));
      });
      return array;
    }
  },
};
