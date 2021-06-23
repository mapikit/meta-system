import { MetaProtocol } from "@api/configuration/protocols/meta-protocol";
import { HTTP_JSONBODY_CONFIGURATION } from "@api/configuration/protocols/HTTP_JSONBODY/configuration";
import { HTTPJsonBodyRoute } from "@api/configuration/protocols/HTTP_JSONBODY/http-jsonbody-route";
import express = require("express");
import { ishttpJsonBodyConfiguration }
  from "@api/configuration/protocols/HTTP_JSONBODY/http-jsonbody-configuration-validation";

export class HTTPJsonBodyProtocol extends MetaProtocol<HTTP_JSONBODY_CONFIGURATION> {
  public constructor (
    protocolConfiguration : HTTP_JSONBODY_CONFIGURATION,
  ) {
    super(protocolConfiguration);
  }

  public validateConfiguration () : void {
    ishttpJsonBodyConfiguration(this.protocolConfiguration);
  }

  public start () : void {
    const httpApp = express();

    const routes = this.protocolConfiguration.routes.map((routeConfig) => {
      return new HTTPJsonBodyRoute(routeConfig).setupRouter();
    });

    httpApp.use(routes);

    httpApp.listen(this.protocolConfiguration.port);
  }
}
