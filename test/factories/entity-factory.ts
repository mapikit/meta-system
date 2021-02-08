import faker from "faker";
import { SchemasType, SchemaTypeDefinition } from "@api/configuration-de-serializer/domain/schemas-type";

export const entityFactory = (schemaFormat : SchemasType["format"]) : unknown => {
  const entity = {};
  for(const prop in schemaFormat) {
    entity[prop] = typeCreation[schemaFormat[prop].type](schemaFormat[prop]["data"]);
  }
  return entity;
};

const typeCreation = {
  string: () : string => {
    return faker.name.jobType();
  },

  number: () : number => {
    return faker.random.number();
  },

  date: () : Date => {
    return new Date();
  },

  boolean: () : boolean => {
    return faker.random.boolean();
  },

  array: (dataType : string) : Array<unknown> => {
    const array = [];
    for (let i = 0; i < faker.random.number({ min: 3, max: 10, precision: 1 }); i++) {
      const newItem = typeCreation[dataType]();
      array.push(newItem);
    }
    return array;
  },

  object: (dataType : Record<string, SchemaTypeDefinition>) : object => {
    const object = {};
    for(const prop in dataType) {
      object[prop] = typeCreation[dataType[prop].type](dataType[prop]["data"]);
    }
    return object;
  },
};
