import faker from "faker";
import { Entity } from "@api/entity/domain/models/entity";

export const entityFactory = (predefined : Partial<Entity>) : Entity => {
  let predefinedKeys = Object.keys(predefined);
  predefinedKeys = predefinedKeys.filter((key) => {
    if(key !== "updatedAt" && key !== "createdAt") {return key;}
  });

  if(predefinedKeys.length > 0) {
    return Entity.toDomain(predefined);
  }

  const properties = createRandomProperties();
  return Entity.toDomain({
    ...properties,
    createdAt: predefined.createdAt,
    updatedAt: predefined.updatedAt,
  });
};

function createRandomProperties () : Partial<Entity> {
  const maxProperties = 3;
  const properties : Partial<Entity> = {};
  for(let property = 0; property < maxProperties; property++) {
    const RandomJsonValues = [true, false, faker.random.number(), faker.random.alphaNumeric()];;
    properties[faker.name.jobArea()] = faker.helpers.randomize(RandomJsonValues);
  };
  return properties;
};
