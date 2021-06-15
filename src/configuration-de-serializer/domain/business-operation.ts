import { ObjectDefinition } from "meta-function-helper";
import {
  BopsConfigurationEntry,
  BopsConstant,
  BopsCustomObject,
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
  public configuration : BopsConfigurationEntry[];
  public customObjects : BopsCustomObject[];

  public constructor (parameters : BusinessOperations) {
    this.name = parameters.name;
    this.input = parameters.input;
    this.output = parameters.output;
    this.constants = parameters.constants;
    this.configuration = parameters.configuration;
    this.customObjects = parameters.customObjects;
  }

  // eslint-disable-next-line max-lines-per-function
  public get modulesRepositoryList () : ModuleRepositoriesData {
    const allRepos = this.configuration.map((configEntry) => {
      return configEntry.moduleRepo;
    });

    const internal = [];
    const external = [];
    const fromSchemas = [];
    const ending = [];

    allRepos.forEach((repository) => {
      if (repository.charAt(0) === "#") {
        return internal.push(repository);
      }

      if (repository.charAt(0) === "@") {
        return fromSchemas.push(repository);
      }

      if (repository.charAt(0) === "%") {
        return ending.push(repository);
      }

      external.push(repository);
    });

    return { internal, external, fromSchemas, ending };
  }
};
