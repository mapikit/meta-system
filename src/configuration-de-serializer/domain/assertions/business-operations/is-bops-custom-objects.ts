import { BopsCustomObject, BopsCustomObjectProperty } from
  "@api/configuration-de-serializer/domain/business-operations";
import { isType } from "@api/configuration-de-serializer/domain/assertions/is-type";

function isCustomObjectProperty (input : unknown) : asserts input is BopsCustomObjectProperty[] {
  if (!Array.isArray(input)) {
    throw Error("Business Operation Input with wrong type found: customObjects.properties should be an Array");
  }

  const properties = input as BopsCustomObjectProperty[];

  properties.forEach((property) => {
    isType("string", "CustomObject property name must be a string", property.name);
    isType("string", "CustomObject property type must be a string", property.type);
  });
}

export function isBopsCustomObjects (input : unknown) : asserts input is BopsCustomObject[] {
  if (!Array.isArray(input)) {
    throw Error("Business Operation Input with wrong type found: customObjects should be an Array");
  }

  const customObjects = input as BopsCustomObject[];

  customObjects.forEach((object) => {
    isType("string", "CustomObject property name must be a string", object.name);
    isCustomObjectProperty(object);
  });

}
