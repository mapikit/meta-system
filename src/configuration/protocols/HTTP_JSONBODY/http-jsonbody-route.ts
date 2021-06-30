import { HTTPRouteConfiguration } from "@api/configuration/protocols/HTTP_JSONBODY/configuration";
import { Request, Response, Router } from "express";
import { HTTPJsonBodyInputMap } from "@api/configuration/protocols/HTTP_JSONBODY/input-map";
import { HTTPJsonBodyOutputMap } from "@api/configuration/protocols/HTTP_JSONBODY/output-map";
import { FunctionManager } from "@api/bops-functions/function-managers/function-manager";

export class HTTPJsonBodyRoute {
  public constructor (
    private routeConfigurations : HTTPRouteConfiguration,
    private functionManager : FunctionManager,
  ) { }

  public setupRouter () : Router {
    const router = Router();
    const method = this.routeConfigurations.method
      .toLocaleLowerCase() as HTTPRouteConfiguration["method"];

    router[method](
      this.routeConfigurations.route,
      this.wrapFunctionInProtocol(),
    );

    return router;
  }

  private wrapFunctionInProtocol () : (req : Request, res : Response) => Promise<void> {
    const bop = this.functionManager.get(this.routeConfigurations.businessOperation);

    return (async (req : Request, res : Response) : Promise<void> => {
      const functionInputs = HTTPJsonBodyInputMap.mapInputs(req, this.routeConfigurations);

      const result = await bop(functionInputs);

      HTTPJsonBodyOutputMap.resolveOutput(result, res, this.routeConfigurations);
    });
  }
}
