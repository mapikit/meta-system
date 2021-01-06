import { RequestHandler } from "express";
import express = require("express");

type HttpMethods = "get" | "patch" | "put" | "delete" | "post";

interface ActiveRoutesList {
  [route : string] : {
    post ?: boolean;
    get ?: boolean;
    path ?: boolean;
    put ?: boolean;
    delete ?: boolean;
  };
}

class MetaRouter {
  private app = express();
  private router = express.Router();

  constructor (baseRoute ?: string) {
    if(baseRoute && !baseRoute.match(/^\/[0-9a-z-]+\/?$/g)) throw new Error("Path error");
    this.app.use(baseRoute ? baseRoute : "/", this.router);
  }

  public createRoute (method : HttpMethods, route : string, handler : RequestHandler) : void {
    if(!route.match(/^((?:\/[0-9a-z-]+)+\/?)$/g)) return;
    this.router[method](route, handler);
  }

  public listenOnPort (port : string | number) : void {
    this.app.listen(port, () => {
      console.log("Now listening on port ", port);
    });
  }

  public get activeRoutes () : ActiveRoutesList {
    const routerStack = this.router.stack;
    const organizedStack : ActiveRoutesList = {};
    for(const layer of routerStack) {
      if(layer.route?.path !== undefined) {
        organizedStack[layer.route.path] = {
          ...layer.route.methods, ...organizedStack[layer.route.path],
        };
      }
    }
    return organizedStack;
  }
};

export default MetaRouter;
