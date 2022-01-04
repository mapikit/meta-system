// Validates the meta-function.json of the custom BOps function
import { MetaFunction, validateFunctionDefinitionConfiguration } from "@meta-system/meta-function-helper";

export class MetaFunctionDescriptionValidation {
  private validated = false;

  public constructor (
    private readonly descriptionFileContent : object,
  ) { }

  public validate () : this {
    validateFunctionDefinitionConfiguration(this.descriptionFileContent);
    this.validated = true;

    return this;
  }

  public getFunctionConfiguration () : MetaFunction {
    if (this.validated) {
      return this.descriptionFileContent as MetaFunction;
    }

    throw Error("Description Not Validated");
  }
}

