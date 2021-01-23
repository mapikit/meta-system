import { BusinessOperation } from "@api/configuration-de-serializer/domain/business-operation";
import { BopsCustomObject } from "@api/configuration-de-serializer/domain/business-operations-type";

export class ValidateBopsCustomObjectsCommand {
  private businessOperation : BusinessOperation;
  private objectMap = new Map<string, BopsCustomObject>();
  private objectsToValidate : Set<BopsCustomObject> = new Set();

  public constructor (operation : BusinessOperation) {
    this.businessOperation =  operation;
  }

  public execute () : void {
    this.validateCustomObjects();
    this.validateCustomObjectLoopReference();
  }

  // eslint-disable-next-line max-lines-per-function
  private validateCustomObjects () : void {
    const names : string[] = [];
    const queriedNames : string[] = [];

    this.businessOperation.customObjects.forEach((customObject) => {
      names.push(customObject.name);

      customObject.properties.forEach((objectProperty) => {
        if (objectProperty.type.charAt(0) === "$") {
          queriedNames.push(objectProperty.type.substring(1));
        }
      });
    });

    // All queried names must exist in the "names"
    queriedNames.forEach((queriedName) => {
      if (!names.includes(queriedName)) {
        throw Error(`Bops Configuration Problem: There is an unreferenced object "${queriedName}"`);
      }
    });
  }

  // I believe this could go as its own command at this pace, however, let's keep it here before the tests
  // eslint-disable-next-line max-lines-per-function
  private validateCustomObjectLoopReference () : void {
    this.businessOperation.customObjects.forEach((customObject) => {
      this.objectMap.set(customObject.name, customObject);

      customObject.properties.forEach((objectProperty) => {
        if (objectProperty.type.charAt(0) === "$") {
          this.objectsToValidate.add(customObject);
        }
      });
    });

    // eslint-disable-next-line max-lines-per-function
    this.objectsToValidate.forEach((value) => {
      const referenceChain : string[] = [];

      referenceChain.push(...this.validateSingleObject(referenceChain, value));
    });
  }

  // eslint-disable-next-line max-lines-per-function
  private validateSingleObject (referenceChain : string[], object ?: BopsCustomObject) : string[] {
    if (object === undefined) {
      throw Error(`Bops Configuration Problem: There is an unreferenced object at "${this.businessOperation.name}"`);
    }

    const hasLooped = referenceChain.includes(object.name);

    if (hasLooped) {
      throw Error(
        `Loop reference detected on the custom objects of the business operation ${this.businessOperation.name}`,
      );
    }

    const resultChain = [...referenceChain, object.name];

    object.properties.forEach((property) => {
      if (property.type.charAt(0) === "$") {
        const referencedName = property.type.substring(1);

        resultChain.push(...this.validateSingleObject(referenceChain, this.objectMap.get(referencedName)));
      }
    });

    return resultChain;
  };
};
