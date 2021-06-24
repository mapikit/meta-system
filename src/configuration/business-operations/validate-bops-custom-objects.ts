import { BusinessOperation } from "./business-operation";
import { BopsCustomObject } from "./business-operations-type";


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

      Object.values(customObject.properties).forEach((objectProperty) => {
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

  private validateCustomObjectLoopReference () : void {
    this.businessOperation.customObjects.forEach((customObject) => {
      this.objectMap.set(customObject.name, customObject);

      Object.values(customObject.properties).forEach((objectProperty) => {
        if (objectProperty.type.charAt(0) === "$") {
          this.objectsToValidate.add(customObject);
        }
      });
    });

    this.objectsToValidate.forEach((object) => {
      // Map of references from Origin<string> to Reference<string>
      const referenceChain : Map<string, string> = new Map();

      this.validateSingleObject(referenceChain, object);
    });
  }

  // eslint-disable-next-line max-lines-per-function
  private validateSingleObject (referenceChain : Map<string, string>, object ?: BopsCustomObject) : void {
    if (object === undefined) {
      throw Error(`Bops Configuration Problem: There is an unreferenced object at "${this.businessOperation.name}"`);
    }

    Object.values(object.properties).forEach((property) => {
      if (property.type.charAt(0) === "$") {
        const referencedName = property.type.substring(1);

        const hasLooped = referenceChain.get(object.name) === referencedName;

        if (hasLooped) {
          throw Error(
            `Loop reference detected on the custom objects of the business operation ${this.businessOperation.name}`,
          );
        }

        referenceChain.set(object.name, referencedName);

        this.validateSingleObject(referenceChain, this.objectMap.get(referencedName));
      }
    });
  };
};
