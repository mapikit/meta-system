import { isProtocol } from "../assertions/protocols/is-protocol";
import { Protocol } from "./protocols";

export class DeserializeProtocolsCommand {
  private result : Protocol[] = [];

  public get protocolsResults () : Protocol[] {
    return this.result;
  }

  public execute (protocols : unknown[]) : void {
    protocols.forEach((protocolData) => {
      isProtocol(protocolData);
      const protocolInstance = new Protocol(protocolData);
      this.result.push(protocolInstance);
    });
  }
};
