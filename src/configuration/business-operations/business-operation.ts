import { ObjectDefinition } from "@meta-system/object-definition";
import {
  BopsConfigurationEntry,
  BopsConstant,
  BopsCustomObject,
  BopsVariable,
  BusinessOperations,
} from "./business-operations-type.js";
import { nanoid } from "nanoid";

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
  public ttl ?: number;
  public readonly identifier : string;

  public constructor (parameters : BusinessOperations) {
    this.name = parameters.name;
    this.input = parameters.input;
    this.output = parameters.output;
    this.constants = parameters.constants;
    this.configuration = parameters.configuration;
    this.customObjects = parameters.customObjects;
    this.variables = parameters.variables;
    this.ttl = parameters.ttl;
    this.identifier = nanoid();
  }

  // eslint-disable-next-line max-lines-per-function
  public get modulesRepositoryList () : ModuleRepositoriesData {
    const internal = [];
    const external = [];
    const fromSchemas = [];
    const ending = [];

    this.configuration.forEach((config) => {
      if (config.moduleType === "internal") {
        return internal.push(config.moduleName);
      }

      // if (config.moduleType === "schemaFunction") {
      //   return fromSchemas.push(config.moduleName);
      // }

      if (config.moduleType === "output") {
        return ending.push(config.moduleName);
      }

      external.push(config.moduleName);
    });

    return { internal, external, fromSchemas, ending };
  }
};
