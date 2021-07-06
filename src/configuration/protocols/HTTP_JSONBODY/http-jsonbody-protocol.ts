import express = require("express");
import { json } from "body-parser";
import { FunctionManager } from "../../../bops-functions/function-managers/function-manager";
import { MetaProtocol } from "../meta-protocol";
import { HTTP_JSONBODY_CONFIGURATION } from "./configuration";
import { ishttpJsonBodyConfiguration } from "./http-jsonbody-configuration-validation";
import { HTTPJsonBodyRoute } from "./http-jsonbody-route";

export class HTTPJsonBodyProtocol extends MetaProtocol<HTTP_JSONBODY_CONFIGURATION> {
  public constructor (
    protocolConfiguration : HTTP_JSONBODY_CONFIGURATION,
    functionManager : FunctionManager,
  ) {
    super(protocolConfiguration, functionManager);
  }

  public validateConfiguration () : void {
    ishttpJsonBodyConfiguration(this.protocolConfiguration);
  }

  // eslint-disable-next-line max-lines-per-function
  public start () : void {
    const httpApp = express();
    httpApp.use(json());

    const routes = this.protocolConfiguration.routes.map((routeConfig) => {
      console.log(`[HTTP_JSONBODY_PROTOCOL] Mapping route "${routeConfig.route}" at port ${
        this.protocolConfiguration.port
      }`);
      return new HTTPJsonBodyRoute(routeConfig, this.functionManager).setupRouter();
    });

    httpApp.use(routes);

    httpApp.listen(this.protocolConfiguration.port, () => {
      console.log(`[HTTP_JSONBODY_PROTOCOL] Finished mapping all routes for port ${
        this.protocolConfiguration.port
      }`);
    });
  }
}
