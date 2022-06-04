import { FunctionManager } from "@meta-system/meta-function-helper";
import { DBProtocol, MetaProtocol } from "@meta-system/meta-protocol-helper";
import { isDbProtocol } from "../configuration/protocols/is-db-protocol";
import { Protocol } from "../configuration/protocols/protocols";
import {
  DBProtocolNewable,
  MetaProtocolNewable,
  ProtocolFunctionManagerClass } from "../bops-functions/function-managers/protocol-function-manager";
import { ConfigurationType } from "../configuration/configuration-type";
import { logger } from "../common/logger/logger";

export class ProtocolsSetup {
  public constructor (
    private readonly systemConfig : ConfigurationType,
    private readonly protocolsManager : ProtocolFunctionManagerClass,
    private readonly bopsManager : FunctionManager,
  ) {}

  // eslint-disable-next-line max-lines-per-function
  public async execute () : Promise<void> {
    logger.operation("[System Protocols] Starting setup of system Protocols");
    const requiredProtocols = this.systemConfig.protocols !== undefined
      ? this.systemConfig.protocols : [];

    for (const protocolConfig of requiredProtocols) {
      const protocol = new Protocol(protocolConfig);
      await this.protocolsManager
        .installProtocol(protocol);
      const NewableProtocol = await this.protocolsManager.getProtocolNewable(protocol.protocol);

      let createdProtocol;

      if (protocol.isDbProtocol) {
        createdProtocol = new (NewableProtocol as DBProtocolNewable)(protocol.configuration, this.systemConfig.schemas);
      } else {
        createdProtocol = new (NewableProtocol as MetaProtocolNewable)(protocol.configuration, this.bopsManager);
      }

      logger.operation("[System Protocols] - Validating protocol configuration for ", protocol.protocol);
      createdProtocol.validateConfiguration(protocolConfig);

      this.protocolsManager.addProtocolInstance(createdProtocol, protocol.identifier);
    }
  }

  // eslint-disable-next-line max-lines-per-function
  public startAllProtocols () : void {
    const requiredProtocols = this.systemConfig.protocols !== undefined
      ? this.systemConfig.protocols : [];

    for (const protocolConfig of requiredProtocols) {
      const classInstance = this.protocolsManager.getProtocolInstance(protocolConfig.identifier);

      logger.operation("[System Protocols] Starting Protocol", protocolConfig.protocol);
      if (isDbProtocol(classInstance)) {
        // We boot DB protocols while adding the schemas
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
      const classInstance = this.protocolsManager.getProtocolInstance(protocolConfig.identifier);
      if(classInstance === undefined) continue;

      if (isDbProtocol(classInstance)) {
        (classInstance as DBProtocol<unknown>).shutdown()
          .catch((error) => {
            console.error(`"${protocolConfig.protocol}" - Protocol Failed to stop executing!`);
            throw error;
          });
        continue;
      }

      (classInstance as MetaProtocol<unknown>).stop();
    }
  }
}
