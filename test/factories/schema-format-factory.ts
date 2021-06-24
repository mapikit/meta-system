import faker from "faker";
import { ExtendedJsonTypes, JsonTypes } from "@api/common/types/json-types";
import { SchemaObject, SchemaTypeDefinitionArray, SchemaTypeDefinitionObject }
  from "@api/configuration/schemas/schemas-type";

const basicStrings : JsonTypes[] = ["boolean", "string", "number", "date"];
const advancedStrings : Exclude<ExtendedJsonTypes, JsonTypes>[] = ["array", "object"];

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
      subtype: {
        ...schemaFormatFactory(maxDepth-1),
      },
    };
  },

  array: (maxDepth : number) : SchemaTypeDefinitionArray => {
    return {
      type: "array",
      subtype:  faker.random.arrayElement([...basicStrings, typeFactory.object(maxDepth-1).data]),
    };
  },
};
