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
  string: (query : string) : string => { return query; },
  number: (query : string) : number => { if(!isNaN(+query)) return Number(query); },
  boolean: (query : string) : boolean => { if(["true", "false"].includes(query)) return query === "true";},
  date : (query : string) : Date => { if(!isNaN(Date.parse(query))) return new Date(query); },
  object: (query : unknown, dataFormat : SchemaObject) : object => {
    if(typeof query === "object") return parseQuery(query, dataFormat);
  },
  array: (query : unknown, dataFormat : string) : Array<unknown> => {
    if(query instanceof Array) {
      const array = [];
      query.forEach(property => { array.push(resolveType[dataFormat](property)); });
      return array;
    }
  },
};
