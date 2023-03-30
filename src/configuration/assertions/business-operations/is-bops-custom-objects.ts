import { isObjectDefinition } from "@meta-system/object-definition";
import { BopsCustomObject } from "../../business-operations/business-operations-type.js";
import { isType } from "../is-type.js";

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
