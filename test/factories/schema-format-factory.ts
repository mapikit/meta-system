import { ObjectDefinition } from "@meta-system/object-definition";
import { faker } from "@faker-js/faker";
import { ExtendedJsonTypes, JsonTypes } from "../../src/common/types/json-types.js";
import { TypeDefinitionDeep } from "@meta-system/object-definition/dist/object-definition-type.js";

const basicStrings : JsonTypes[] = ["boolean", "string", "number", "date"];
const advancedStrings : Exclude<ExtendedJsonTypes, JsonTypes>[] = ["array", "object"];

export const schemaFormatFactory = (maxDepth = 3) : ObjectDefinition => {
  const newFormat : ObjectDefinition = {};

  for (let property = 0; property < 6; property += faker.helpers.arrayElement([1, 2])) {
    const type = faker.helpers.arrayElement([...basicStrings, ...advancedStrings]);
    if(type === "object" || type === "array") {
      if(maxDepth > 0) newFormat[faker.person.jobType()] = typeFactory[type](maxDepth);
    }
    else newFormat[faker.person.jobType()] = { type };
  }

  return newFormat;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const typeFactory : { [type : string] : (maxDepth ?: number) => any } = {
  object: (maxDepth : number) : TypeDefinitionDeep => {
    return {
      type: "object",
      subtype: {
        ...schemaFormatFactory(maxDepth-1),
      },
    };
  },

  array: (maxDepth : number) : TypeDefinitionDeep => {
    return {
      type: "array",
      subtype:  faker.helpers.arrayElement([...basicStrings, typeFactory.object(maxDepth-1).data]),
    };
  },
};
