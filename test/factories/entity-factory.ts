import faker from "faker";
import { SchemasType, SchemaTypeDefinition } from "@api/configuration/domain/schemas-type";

export const entityFactory = (schemaFormat : SchemasType["format"]) : object => {
  const entity = {};
  for(const prop in schemaFormat) {
    entity[prop] = typeCreation[schemaFormat[prop].type](schemaFormat[prop]["data"]);
  }
  return entity;
};

const typeCreation = {
  string: () : string => faker.lorem.sentence(faker.random.number({ min: 2, max: 5 })),
  number: () : number => faker.random.number(),
  date: () : Date => faker.date.between("1500", "2500"),
  boolean: () : boolean =>  faker.random.boolean(),

  array: (dataType : string) : Array<unknown> => {
    const array = [];
    for (let i = 0; i < faker.random.number({ min: 2, max: 5, precision: 1 }); i++) {
      const newItem = typeCreation[typeof dataType === "string" ? dataType : "object"](dataType);
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
