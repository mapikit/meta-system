import "module-alias/register";
import { HTTPRouteConfiguration } from "@api/configuration/protocols/HTTP_JSONBODY/configuration";
import { Request, Response, Router } from "express";
import { HTTPJsonBodyInputMap } from "@api/configuration/protocols/HTTP_JSONBODY/input-map";
import { HTTPJsonBodyOutputMap } from "@api/configuration/protocols/HTTP_JSONBODY/output-map";

export class HTTPJsonBodyRoute {
  public constructor (
    private routeConfigurations : HTTPRouteConfiguration,
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
    // TODO get actual function
    const getBop = (data : unknown) : object => ({ a: this.routeConfigurations.businessOperation, data });

    return (async (req : Request, res : Response) : Promise<void> => {
      const functionInputs = HTTPJsonBodyInputMap.mapInputs(req, this.routeConfigurations);

      const result = await getBop(functionInputs);

      HTTPJsonBodyOutputMap.resolveOutput(result, res, this.routeConfigurations);
    });
  }
}
