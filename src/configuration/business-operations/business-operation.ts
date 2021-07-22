import { ObjectDefinition } from "meta-function-helper";
import {
  BopsConfigurationEntry,
  BopsConstant,
  BopsCustomObject,
  BopsVariable,
  BusinessOperations,
} from "./business-operations-type";

interface ModuleRepositoriesData {
  internal : string[];
  ending : string[];
  external : string[];
  fromSchemas : string[];
}

export class BusinessOperation implements BusinessOperations {
  public name : string;
  public input : ObjectDefinition;
  public output : ObjectDefinition;
  public constants : BopsConstant[];
  public variables : BopsVariable[];
  public configuration : BopsConfigurationEntry[];
  public customObjects : BopsCustomObject[];

  public constructor (parameters : BusinessOperations) {
    this.name = parameters.name;
    this.input = parameters.input;
    this.output = parameters.output;
    this.constants = parameters.constants;
    this.configuration = parameters.configuration;
    this.customObjects = parameters.customObjects;
    this.variables = parameters.variables;
  }

  // eslint-disable-next-line max-lines-per-function
  public get modulesRepositoryList () : ModuleRepositoriesData {
    const internal = [];
    const external = [];
    const fromSchemas = [];
    const ending = [];

    this.configuration.forEach((config) => {
      if (config.moduleType === "internal") {
        return internal.push(config.moduleRepo);
      }

      if (config.moduleType === "schemaFunction") {
        return fromSchemas.push(config.moduleRepo);
      }

      if (config.moduleType === "output") {
        return ending.push(config.moduleRepo);
      }

      external.push(config.moduleRepo);
    });

    return { internal, external, fromSchemas, ending };
  }
};
