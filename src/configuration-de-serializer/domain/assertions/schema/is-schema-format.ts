import { SchemaObject, SchemaTypeDefinition } from "@api/configuration-de-serializer/domain/schemas-type";
import { isSchemaTypeArray } from "./is-schema-type-array";
import { isSchemaTypeDefault } from "./is-schema-type-default";
import { isSchemaTypeObject } from "./is-schema-type-object";

type FunctionMapper = Record<SchemaTypeDefinition["type"], (input : unknown) => void>;

const formatFunctionMapper : FunctionMapper = {
  "array": isSchemaTypeArray,
  "object": isSchemaTypeObject,
  "string": isSchemaTypeDefault,
  "number": isSchemaTypeDefault,
  "boolean": isSchemaTypeDefault,
  "date": isSchemaTypeDefault,
};

// eslint-disable-next-line max-lines-per-function
export function isSchemaFormat (input : unknown) : asserts input is SchemaObject {
  if (typeof input !== "object") {
    throw new TypeError("Schema with incorrect format found: 'Property \"format\" is expected to be an object'");
  }

  Object.values(input).forEach((inputValue) => {
    const currentType = (inputValue as SchemaTypeDefinition).type;
    const validationFunction = formatFunctionMapper[currentType];

    if (validationFunction === undefined) {
      throw new TypeError("Schema with incorrect format found: 'Unknown JSON type found.'");
    };

    if (typeof inputValue !== "object") {
      throw new TypeError("Schema with incorrect format found: 'Format type definition expected to be an object'");
    }

    validationFunction(inputValue);
  });
};
