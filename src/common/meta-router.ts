import { RequestHandler } from "express";
import { RouteFormatError } from "./errors/route-format-error";
import { PortFormatError } from "./errors/port-format-error";

import express = require("express");

export type HttpMethods = "get" | "patch" | "put" | "delete" | "post";

interface ActiveRoutesList {
  [route : string] : {
    post ?: boolean;
    get ?: boolean;
    path ?: boolean;
    put ?: boolean;
    delete ?: boolean;
  };
}
/**
 * Easily create new routes for a system with given configuration
 */
class MetaRouter {
  private app = express();
  private router = express.Router();

  /**
   * Creates a new MetaRouter instance
   * @param baseRoute : a base route that preceeds every route. Routes must start with a "/"
   */
  constructor (baseRoute ?: string) {
    if(baseRoute && !baseRoute.match(/^\/[0-9a-z-]+\/?$/g)) throw new RouteFormatError;
    this.app.use(baseRoute ? baseRoute : "/", this.router);
  }

  /**
   * Creates a new http route with the specified method and handler.
   * These will only work when you start listening with the `.listenOnPort` method
   * @param method The http method to be used. Must be either "post", "get", "delete", "patch" or "put"
   * @param route The route to be used. Routes must start with "/"
   * @param handler A handler (function) to resolve requests. Can access request and response parameters
   */
  public createRoute (method : HttpMethods, route : string, handler : RequestHandler) : void {
    if(!route.match(/^((?:\/[0-9a-z-]+)+\/?)$/g)) throw new RouteFormatError;
    this.router[method](route, handler);
  }

  /**
   * Starts listening on the given port
   * @param port The port to start listening to. Can be a number or a numeric string
   */
  public listenOnPort (port : string | number) : void {
    if(!String(port).match(/^\d+$/)) throw new PortFormatError;
    this.app.listen(port, () => {
      console.log("Now listening on port", port);
    });
  }

  /**
   * Returns the currently active routes as an object
   *
   * @example {"/foo": { post: true }}
   */
  public get activeRoutes () : ActiveRoutesList {
    const routerStack = this.router.stack;
    const organizedStack : ActiveRoutesList = {};
    for(const layer of routerStack) {
      if(layer.route?.path) {
        organizedStack[layer.route.path] = {
          ...organizedStack[layer.route.path],
          ...layer.route.methods,
        };
      }
    }
    return organizedStack;
  }
};

export default MetaRouter;
