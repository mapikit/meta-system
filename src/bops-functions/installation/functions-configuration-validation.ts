// Validates the meta-function.json of the custom BOps function
import MetaFunctionHelper, { MetaFunction } from "meta-function-helper";

export class MetaFunctionDescriptionValidation {
  private validated = false;

  public constructor (
    private readonly descriptionFileContent : string,
  ) { }

  public validate () : void {
    MetaFunctionHelper.validateStringConfiguration(this.descriptionFileContent);

    this.validated = true;
  }

  public getFunctionConfiguration () : MetaFunction {
    if (this.validated) {
      return JSON.parse(this.descriptionFileContent) as MetaFunction;
    }

    throw Error("Description Not Validated");
  }
}

