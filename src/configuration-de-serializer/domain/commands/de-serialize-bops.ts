// eslint-disable-next-line max-len
import { isBusinessOperations } from "@api/configuration-de-serializer/domain/assertions/business-operations/is-business-operations";
import { BopsCustomObject, BusinessOperations } from "@api/configuration-de-serializer/domain/business-operations";

export class DeserializeBopsCommand {
  private result ?: BusinessOperations;
  public customObjects : BopsCustomObject[];

  public get bopsResults () : BusinessOperations {
    return this.result;
  }

  public execute (businessOperations : unknown) : void {
    isBusinessOperations(businessOperations);

    this.result = businessOperations;

    this.validateCustomObjects();
    this.validateCustomObjectLoopReference();
  }

  // eslint-disable-next-line max-lines-per-function
  private validateCustomObjects () : void {
    const names : string[] = [];
    const queriedNames : string[] = [];

    this.result.customObjects.forEach((customObject) => {
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
    const objectMap = new Map<string, BopsCustomObject>();
    const objectsToValidate : Set<BopsCustomObject> = new Set();

    this.result.customObjects.forEach((customObject) => {
      objectMap.set(customObject.name, customObject);

      customObject.properties.forEach((objectProperty) => {
        if (objectProperty.type.charAt(0) === "$") {
          objectsToValidate.add(customObject);
        }
      });
    });

    // eslint-disable-next-line max-lines-per-function
    objectsToValidate.forEach((value) => {
      const referenceChain : string[] = [];

      // eslint-disable-next-line max-lines-per-function
      const validateSingleObject = (object ?: BopsCustomObject) : void => {
        if (object === undefined) {
          throw Error(`Bops Configuration Problem: There is an unreferenced object at "${this.bopsResults.name}"`);
        }

        const hasLooped = referenceChain.includes(object.name);

        if (hasLooped) {
          throw Error(
            `Loop reference detected on the custom objects of the business operation ${this.bopsResults.name}`,
          );
        }

        referenceChain.push(object.name);

        object.properties.forEach((property) => {
          if (property.type.charAt(0) === "$") {
            const referencedName = property.type.substring(1);

            validateSingleObject(objectMap.get(referencedName));
          }
        });
      };

      validateSingleObject(value);
    });
  }
}
