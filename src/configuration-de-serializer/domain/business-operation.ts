import {
  BopsConfigurationEntry,
  BopsConstant,
  BopsCustomObject,
  BopsInput,
  BopsOutput,
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
  public inputs : BopsInput[];
  public outputs : BopsOutput[];
  public route ?: string;
  public constants : BopsConstant[];
  public configuration : BopsConfigurationEntry[];
  public usedAsRoute : boolean;
  public customObjects : BopsCustomObject[];

  public constructor (parameters : BusinessOperations) {
    this.name = parameters.name;
    this.inputs = parameters.inputs;
    this.outputs = parameters.outputs;
    this.route = parameters.route;
    this.constants = parameters.constants;
    this.configuration = parameters.configuration;
    this.usedAsRoute = parameters.usedAsRoute;
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
