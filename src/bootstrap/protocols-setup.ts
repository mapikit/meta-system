import { FunctionManager } from "@meta-system/meta-function-helper";
import { DBProtocol, MetaProtocol } from "@meta-system/meta-protocol-helper";
import { isDbProtocol } from "configuration/protocols/is-db-protocol";
import { ProtocolFunctionManagerClass } from "../bops-functions/function-managers/protocol-function-manager";
import { ConfigurationType } from "../configuration/configuration-type";

export class ProtocolsSetup {
  public constructor (
    private readonly systemConfig : ConfigurationType,
    private readonly protocolsManager : ProtocolFunctionManagerClass,
    private readonly bopsManager : FunctionManager,
  ) {}

  public async execute () : Promise<void> {
    console.log("[System Protocols] Starting setup of system Protocols");
    const requiredProtocols = this.systemConfig.protocols !== undefined
      ? this.systemConfig.protocols : [];

    for (const protocolConfig of requiredProtocols) {
      await this.protocolsManager.installProtocol(protocolConfig.protocolType, protocolConfig.protocolVersion);
      const NewableProtocol = await this.protocolsManager.getProtocolNewable(protocolConfig.protocolType);

      const createdProtocol = new NewableProtocol(protocolConfig.configuration, this.bopsManager);
      console.log("[System Protocols] - Validating protocol configuration for ", protocolConfig.protocolType);
      createdProtocol.validateConfiguration();

      this.protocolsManager.addProtocolInstance(createdProtocol, protocolConfig.protocolType);
    }
  }

  // eslint-disable-next-line max-lines-per-function
  public startAllProtocols () : void {
    const requiredProtocols = this.systemConfig.protocols !== undefined
      ? this.systemConfig.protocols : [];

    for (const protocolConfig of requiredProtocols) {
      const classInstance = this.protocolsManager.getProtocolInstance(protocolConfig.protocolType);

      console.log("[System Protocols] Starting Protocol", protocolConfig.protocolType);
      if (isDbProtocol(classInstance)) {
        (classInstance as DBProtocol<unknown>).initialize()
          .catch((error) => {
            console.error(`"${protocolConfig.protocolType}" - Protocol Failed to boot!`);
            throw error;
          });
        continue;
      }

      (classInstance as MetaProtocol<unknown>).start();
    }
  }

  // eslint-disable-next-line max-lines-per-function
  public stopAllProtocols () : void {
    const requiredProtocols = this.systemConfig.protocols !== undefined
      ? this.systemConfig.protocols : [];

    for (const protocolConfig of requiredProtocols) {
      const classInstance = this.protocolsManager.getProtocolInstance(protocolConfig.protocolType);

      if (isDbProtocol(classInstance)) {
        (classInstance as DBProtocol<unknown>).shutdown()
          .catch((error) => {
            console.error(`"${protocolConfig.protocolType}" - Protocol Failed to stop executing!`);
            throw error;
          });
        continue;
      }

      (classInstance as MetaProtocol<unknown>).stop();
    }
  }
}
