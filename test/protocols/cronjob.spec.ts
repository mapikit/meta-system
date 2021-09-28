import { expect } from "chai";
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

  it("Protocol setup", (done) => {
    protocolsSetup.execute()
      .then(() => done())
      .catch(error => expect.fail(error));
  });

  it("Protocol setup and execution", (done) => {
    protocolsSetup.execute()
      .then(() =>
        functionsManager.setup()
          .then(() => {
            try {
              protocolsSetup.startAllProtocols();
              protocolsSetup.stopAllProtocols();
              done();
            }
            catch (error) { expect.fail(error); }
          })
          .catch(error => expect.fail(error)))
      .catch(error => expect.fail(error));
  });
});

