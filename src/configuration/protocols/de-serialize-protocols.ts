import { isProtocol } from "../assertions/protocols/is-protocol";
import { Protocol } from "./protocols";

export class DeserializeProtocolsCommand {
  private result : Protocol[] = [];

  public get protocolsResults () : Protocol[] {
    return this.result;
  }

  public execute (protocols : unknown[]) : void {
    const foundIdentifiers : Record<string, string> = {};
    protocols.forEach((protocolData) => {
      isProtocol(protocolData);
      if(Object.keys(foundIdentifiers).includes(protocolData.identifier)) {
        throw Error(`Duplicate protocol identifier "${protocolData.identifier}"\n` +
          `\t - Protocols "${protocolData.protocol}" and `+
            `"${foundIdentifiers[protocolData.identifier]}" have the same identifier`);
      }
      foundIdentifiers[protocolData.identifier] = protocolData.protocol;
      const protocolInstance = new Protocol(protocolData);
      this.result.push(protocolInstance);
    });
  }
};
