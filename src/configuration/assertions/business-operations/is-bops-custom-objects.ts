import { BopsCustomObject } from
  "@api/configuration/business-operations/business-operations-type";
import { isType } from "@api/configuration/assertions/is-type";
import { isObjectDefinition } from "meta-function-helper/dist/src/object-definition/is-object-definition";

export function isBopsCustomObjects (input : unknown) : asserts input is BopsCustomObject[] {
  if (!Array.isArray(input)) {
    throw Error("Business Operation Input with wrong type found: customObjects should be an Array");
  }

  const customObjects = input as BopsCustomObject[];

  customObjects.forEach((object) => {
    isType("string", "CustomObject property name must be a string", object.name);
    isObjectDefinition(object.properties);
  });

}
