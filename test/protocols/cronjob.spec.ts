import { expect } from "chai";
import { FunctionSetup } from "../../src/bootstrap/function-setup";
import { ProtocolsSetup } from "../../src/bootstrap/protocols-setup";
import { externalFunctionManagerSingleton } from "../../src/bops-functions/function-managers/external-function-manager";
import internalFunctionManager from "../../src/bops-functions/function-managers/internal-function-manager";
import { protocolFunctionManagerSingleton } from "../../src/bops-functions/function-managers/protocol-function-manager";
import { testSystem } from "./data/system";



describe("Protocols Testing", () => {
  let functionsManager : FunctionSetup;
  let protocolsSetup : ProtocolsSetup;

  beforeEach(() => {
    functionsManager = new FunctionSetup(
      internalFunctionManager,
      externalFunctionManagerSingleton,
      protocolFunctionManagerSingleton,
      testSystem,
    );

    protocolsSetup = new ProtocolsSetup(
      testSystem,
      protocolFunctionManagerSingleton,
      functionsManager.getBopsManager(),
    );
  });

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

