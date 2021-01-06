export class PortFormatError extends Error {
  constructor () {
    super();
    this.message = "The given port is not formated properly. Ports may only contain digits";
    this.name = "PortFormatError";
  }
};
