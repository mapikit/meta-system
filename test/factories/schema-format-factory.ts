import faker from "faker";
import {
  SchemaObject,
  SchemaTypeDefinitionArray,
  SchemaTypeDefinitionObject,
} from "@api/configuration-de-serializer/domain/schemas-type";


type basicTypes = "boolean" | "string" | "number" | "date";
const basicStrings : basicTypes[] = ["boolean", "string", "number", "date"];
type advancedTypes = "array" | "object";
const advancedStrings : advancedTypes[] = ["array", "object"];

export const schemaFormatFactory = (maxDepth = 3) : SchemaObject => {
  const newFormat : SchemaObject = {};

  for (let property = 0; property < 6; property += faker.random.arrayElement([1, 2])) {
    const type = faker.random.arrayElement([...basicStrings, ...advancedStrings]);
    if(type === "object" || type === "array") {
      if(maxDepth > 0) newFormat[faker.name.jobType()] = typeFactory[type](maxDepth);
    }
    else newFormat[faker.name.jobType()] = { type };
  }

  return newFormat;
};

const typeFactory : { [type : string] : (maxDepth ?: number) => any } = {
  object: (maxDepth : number) : SchemaTypeDefinitionObject => {
    return {
      type: "object",
      data: {
        ...schemaFormatFactory(maxDepth-1),
      },
    };
  },

  array: (maxDepth : number) : SchemaTypeDefinitionArray => {
    return {
      type: "array",
      data:  faker.random.arrayElement([...basicStrings, typeFactory.object(maxDepth-1)]),
    };
  },
};
