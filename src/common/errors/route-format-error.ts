export class RouteFormatError extends Error {
  constructor () {
    super();
    this.message = "The given route is not formated properly.";
    this.name = "RouteFormatError";
  }
};
