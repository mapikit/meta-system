import { SchemasType } from "@api/configuration-de-serializer/domain/schemas-type";

export class DeserializeSchemasCommand {
  private defaultError = TypeError("Input contains invalid Schema");
  private result : SchemasType[];

  public get resultSchemas () : SchemasType[] {
    return this.result;
  };

  // public constructor () {}

  public execute (schemaList : unknown[]) : void {
    schemaList.forEach((input) => {
      this.isSchema(input);
      this.result.push(input);
    });
  }

  // eslint-disable-next-line max-lines-per-function
  private isSchema (input : unknown) : asserts input is SchemasType {
    if (typeof input !== "object") {
      throw this.defaultError;
    }

    const schemasRequiredKeys : Array<keyof SchemasType> = ["name", "format", "routes"];
    const inputKeys = Object.keys(input);
    const hasAllRequiredKeys = schemasRequiredKeys.some((requiredKey) =>
      inputKeys.includes(requiredKey),
    );

    if (!hasAllRequiredKeys) {
      throw this.defaultError;
    }

    const schemaLikeInput = input as SchemasType;

    if (typeof schemaLikeInput.name !== "string") {
      throw this.defaultError;
    }

    this.isSchemaRoutesConfiguration(schemaLikeInput);
    // Assert format type
  }

  // eslint-disable-next-line max-lines-per-function
  private isSchemaRoutesConfiguration (input : unknown) : asserts input is SchemasType["routes"] {
    if (typeof input !== "object") {
      throw this.defaultError;
    }

    const routesRequiredKeys : Array<keyof SchemasType["routes"]> = [
      "getMethodEnabled",
      "postMethodEnabled",
      "deleteMethodEnabled",
      "patchMethodEnabled",
      "putMethodEnabled",
      "queryParamsGetEnabled",
    ];

    const inputKeys = Object.keys(input);
    const hasAllRequiredKeys = routesRequiredKeys.some((requiredKey) =>
      inputKeys.includes(requiredKey),
    );

    if (!hasAllRequiredKeys) {
      throw this.defaultError;
    }

    const allValuesAreBoolean = Object.values(input).every((value) => typeof value === "boolean");

    if (!allValuesAreBoolean) {
      throw this.defaultError;
    }
  }
};
