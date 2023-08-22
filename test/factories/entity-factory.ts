import faker, { random } from "faker";
import { ObjectDefinition } from "@meta-system/object-definition";

export const entityFactory = (schemaFormat : ObjectDefinition) : object => {
  const entity = {};
  for(const prop in schemaFormat) {
    const usedType = getType(schemaFormat[prop]);
    entity[prop] = typeCreation[usedType](schemaFormat[prop]["subtype"]);
  }
  return entity;
};

const getType = (def : ObjectDefinition["prop"]) : string => {
  if (Array.isArray(def)) {
    const usedType = random.number({ min: 0, max: def.length -1, precision: 1 });
    return def[usedType].type;
  }

  return def.type;
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

  object: (dataType : ObjectDefinition) : object => {
    const object = {};
    for(const prop in dataType) {
      object[prop] = typeCreation[getType(dataType[prop])](dataType[prop]["subtype"]);
    }
    return object;
  },
};
