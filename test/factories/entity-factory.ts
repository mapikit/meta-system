import { faker } from "@faker-js/faker";
import { ObjectDefinition } from "@meta-system/object-definition";
const { number, lorem, date, datatype } = faker;

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
    const usedType = number.int({ min: 0, max: def.length -1 });
    return def[usedType].type;
  }

  return def.type;
};

const typeCreation = {
  string: () : string => lorem.sentence(number.int({ min: 2, max: 5 })),
  number: () : number => number.int(),
  date: () : Date => date.between({ from: "1500", to: "2500" }),
  boolean: () : boolean =>  datatype.boolean(),

  array: (dataType : string) : Array<unknown> => {
    const array = [];
    for (let i = 0; i < number.int({ min: 2, max: 5 }); i++) {
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
