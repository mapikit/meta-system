import faker from "faker";
import { SchemaObject, SchemaTypeDefinition } from "@api/configuration-de-serializer/domain/schemas-type";


type basicTypes = "boolean" | "string" | "number" | "date";
const basicStrings : basicTypes[] = ["boolean", "string", "number", "date"];
type advancedTypes = "array" | "object";
const advancedStrings : advancedTypes[] = ["array", "object"];

export const schemaFormatFactory = (maxDepth = 3) : SchemaObject => {
  const creationInput : SchemaObject = {};

  for (let property = 0; property < 7; property += faker.random.arrayElement([1, 2])) {
    const type = faker.random.arrayElement([...basicStrings, ...advancedStrings]);
    if(type === "object" || type === "array") {
      if(maxDepth > 0) {
        creationInput[faker.name.jobType()] = typeFactory[type](maxDepth);
      }
    }
    else {
      creationInput[faker.name.jobType()] = { type };
    }
  }

  return creationInput;
};

const typeFactory : { [type : string] : (maxDepth ?: number) => SchemaTypeDefinition } = {
  object: (maxDepth : number) : SchemaTypeDefinition => {
    return {
      type: "object",
      data: {
        ...schemaFormatFactory(maxDepth-1),
      },
    };
  },

  array: () : SchemaTypeDefinition => {
    return {
      type: "array",
      data:  faker.random.arrayElement(basicStrings),
    };
  },
};
