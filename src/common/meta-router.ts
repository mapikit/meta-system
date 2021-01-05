import express = require("express");

type HttpMethods = "get" | "patch" | "put" | "delete" | "post";

interface ActiveRoutersList {
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

  constructor (baseRoute : string) {
    const resolvedBaseRoute = baseRoute.startsWith("/") ? baseRoute : `/${baseRoute}`;
    this.app.use(resolvedBaseRoute, this.router);
  }

  public createRoute (method : HttpMethods, route : string, handler : express.RequestHandler) : void {
    const resolvedRoute = route.startsWith("/") ? route : `/${route}`;
    this.router[method](resolvedRoute, handler);
  }

  public listenOnPort (port : string | number) : void {
    this.app.listen(port, () => {
      console.log("Now listening on port ", port);
    });
  }

  public get activeRoutes () : ActiveRoutersList {
    const routerStack = this.router.stack;
    const organizedStack : ActiveRoutersList = {};
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
