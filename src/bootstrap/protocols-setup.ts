import { FunctionManager } from "@meta-system/meta-function-helper";
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

  public startAllProtocols () : void {
    const requiredProtocols = this.systemConfig.protocols !== undefined
      ? this.systemConfig.protocols : [];

    for (const protocolConfig of requiredProtocols) {
      const classInstance = this.protocolsManager.getProtocolInstance(protocolConfig.protocolType);

      console.log("[System Protocols] Starting Protocol", protocolConfig.protocolType);
      classInstance.start();
    }
  }

  public stopAllProtocols () : void {
    const requiredProtocols = this.systemConfig.protocols !== undefined
      ? this.systemConfig.protocols : [];

    for (const protocolConfig of requiredProtocols) {
      const classInstance = this.protocolsManager.getProtocolInstance(protocolConfig.protocolType);

      classInstance.stop();
    }
  }
}
