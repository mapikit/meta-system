import { expect } from "chai";
import { asyncTestThrow } from "../helpers/test-throw.js";
import { FunctionSetup } from "../../src/bootstrap/function-setup.js";
import { ProtocolsSetup } from "../../src/bootstrap/protocols-setup.js";
import internalFunctionManager from "../../src/bops-functions/function-managers/internal-function-manager.js";
import { purgeTestPackages, testExternalManager, testProtocolManager } from "../test-managers.js";
import { testSystem } from "./data/system.js";

describe("Protocols Testing", () => {
  const functionsManager = new FunctionSetup(
    internalFunctionManager,
    testExternalManager,
    testProtocolManager,
    testSystem,
  );
  const protocolsSetup = new ProtocolsSetup(
    testSystem,
    testProtocolManager,
    functionsManager.getBopsManager(),
  );

  before(purgeTestPackages);
  afterEach(purgeTestPackages);

  it.only("Protocol setup", async () => {
    const result = await asyncTestThrow(async () => {
      await protocolsSetup.execute();
    });


    console.log(result.error);
    expect(result.error).to.be.undefined;
    expect(result.thrown).to.be.false;
  });

  it("Protocol setup and execution", async () => {
    const result = await asyncTestThrow(async () => {
      await protocolsSetup.execute().then(() => {
        void functionsManager.setup()
          .then(async () => {
            protocolsSetup.startAllProtocols();
            await protocolsSetup.stopAllProtocols();
          });
      });
    });

    expect(result.error).to.be.undefined;
    expect(result.thrown).to.be.false;
  });
});


