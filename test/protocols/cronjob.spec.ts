import { expect } from "chai";
import { asyncTestThrow } from "../helpers/test-throw";
import { FunctionSetup } from "../../src/bootstrap/function-setup";
import { ProtocolsSetup } from "../../src/bootstrap/protocols-setup";
import internalFunctionManager from "../../src/bops-functions/function-managers/internal-function-manager";
import { purgeTestPackages, testExternalManager, testProtocolManager } from "../test-managers";
import { testSystem } from "./data/system";

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

  it("Protocol setup", async () => {
    const result = await asyncTestThrow(async () => {
      await protocolsSetup.execute();
    });

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


