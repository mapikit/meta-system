import { Request } from "express";
import { setValueAtObjectPath } from "../../../common/helpers/set-value-at-path";
import { getObjectProperty } from "../../../schemas/application/query-builder/get-object-property";
import { HTTPRouteConfiguration, InputMap } from "./configuration";

export class HTTPJsonBodyInputMap {
  /**
   * Recieves an HTTP request and returns an object compatible with the activationFunction params
   */
  public static mapInputs (request : Request, routeConfig : HTTPRouteConfiguration) : unknown {
    const inputObject = {};

    routeConfig.inputMapConfiguration.forEach((inputMapper) => {
      const propertyValue = this.getValueFromRequest(request, inputMapper);
      setValueAtObjectPath(inputObject, inputMapper.targetPath, propertyValue);
    });

    return inputObject;
  }

  private static getValueFromRequest (request : Request, inputMap : InputMap) : unknown {
    if (inputMap.origin === "body") {
      return getObjectProperty(request.body, inputMap.originPath);
    }

    if (inputMap.origin === "queryParams") {
      return request.query[inputMap.originPath];
    }

    if (inputMap.origin === "headers") {
      return request.headers[inputMap.originPath];
    }

    return request.params[inputMap.originPath];
  }
}
