import { getObjectProperty } from "@api/schemas/application/query-builder/get-object-property";
import clone from "just-clone";
import { HTTPRouteConfiguration } from "@api/configuration/protocols/HTTP_JSONBODY/configuration";
import { Response } from "express";

export class HTTPJsonBodyOutputMap {
  /**
   * Gets the BOps output, maps it to a valid HTTP response and resolves the request
   */
  // eslint-disable-next-line max-lines-per-function
  public static resolveOutput (
    outputData : object, response : Response, routeConfiguration : HTTPRouteConfiguration) : void {
    const outputBody = clone(routeConfiguration.resultMapConfiguration.body);
    const statusCode = this.getStatusCode(outputData, routeConfiguration);

    this.setObjectResponse(outputBody, outputData);
    this.setHeaders(outputData, routeConfiguration, response);

    response.status(statusCode);
    response.send(outputBody);
  }

  private static setObjectResponse (outputBody : object, data : object) : void {
    Object.keys(outputBody).forEach((outputKey) => {
      if (typeof outputBody[outputKey] === "string") {
        outputBody[outputKey] = getObjectProperty(data, outputBody[outputKey]);
        return;
      }

      this.setObjectResponse(outputBody[outputKey], data);
    });
  }

  private static getStatusCode (outputData : object, routeConfiguration : HTTPRouteConfiguration) : number {
    let statusCode;

    try {
      if (typeof routeConfiguration.resultMapConfiguration.statusCode === "number") {
        statusCode = routeConfiguration.resultMapConfiguration.statusCode;
      } else {
        statusCode = getObjectProperty(outputData, routeConfiguration.resultMapConfiguration.statusCode);
      }
    } catch {
      statusCode = 500;
    }

    return statusCode;
  }

  private static setHeaders (
    outputData : object, routeConfiguration : HTTPRouteConfiguration, response : Response) : void {
    routeConfiguration.resultMapConfiguration.headers.forEach((headerInfo) => {
      const headerName = Object.keys(headerInfo)[0];
      const headerValue = headerInfo[headerName];
      response.setHeader(headerName, getObjectProperty(outputData, headerValue));
    });
  }
}
