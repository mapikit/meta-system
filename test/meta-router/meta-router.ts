/* eslint-disable max-lines-per-function */
require("module-alias/register");
import chai from "chai";
import { RequestHandler } from "express";
import MetaRouter from "@api/common/meta-router";
import { httpMethodFactory } from "@test/factories/method-factory";
const expect = chai.expect;

describe("Meta Router Test", () => {
  const mockHandler : RequestHandler = (req, res) => {
    console.log("Request received on", req.originalUrl);
    res.send("Success");
  };

  it("Creates new Routes and Starts Listening", async () => {
    const metaRouter = new MetaRouter("/test-route");
    const httpMethod = httpMethodFactory();

    metaRouter.createRoute(httpMethod, "/success", mockHandler);
    try {
      await metaRouter.listenOnPort(8000);
    } catch(error) {
      expect(error).to.be.undefined;
    }
    expect(metaRouter.activeRoutes["/success"][httpMethod]).to.be.true;
  });

  it("Fails to Create Route - Invalid Base Route", async () => {
    try{
      new MetaRouter("test-route");
    }catch(error) {
      expect(error.name).to.be.equal("RouteFormatError");
    }
  });

  it("Fails to Create Route - Invalid Route", async () => {
    const metaRouter = new MetaRouter("/test-route");
    const httpMethod = httpMethodFactory();

    try {
      metaRouter.createRoute(httpMethod,"invalid-route", mockHandler);
    } catch(error) {
      expect(error.name).to.be.equal("RouteFormatError");
    }
  });

  it("Fails to Create Route - Invalid Port", async () => {
    const metaRoute = new MetaRouter("/test-route");
    const httpMethod = httpMethodFactory();

    metaRoute.createRoute(httpMethod, "/invalid-port", mockHandler);

    try {
      await metaRoute.listenOnPort("InvalidPort");
    } catch(error) {
      expect(error.name).to.be.equal("PortFormatError");
    }
  });

});
