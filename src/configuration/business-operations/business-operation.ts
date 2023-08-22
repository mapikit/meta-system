import { ObjectDefinition } from "@meta-system/object-definition";
import {
  BopsConfigurationEntry,
  BopsConstant,
  BopsVariable,
  BusinessOperationType,
} from "./business-operations-type.js";

export class BusinessOperation implements BusinessOperationType {
  public input : ObjectDefinition;
  public output : ObjectDefinition;
  public constants : BopsConstant[];
  public variables : BopsVariable[];
  public configuration : BopsConfigurationEntry[];
  public ttl ?: number;
  public readonly identifier : string;

  public constructor (parameters : BusinessOperationType) {
    this.input = parameters.input;
    this.output = parameters.output;
    this.constants = parameters.constants;
    this.configuration = parameters.configuration;
    this.variables = parameters.variables;
    this.ttl = parameters.ttl;
    this.identifier = parameters.identifier;
  }
};
