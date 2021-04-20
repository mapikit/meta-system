export class TTLExceededError extends Error {
  constructor (timeExecuted : number) {
    super(`Time limit exceeded after ${timeExecuted}ms`);
    this.name = TTLExceededError.name;
  }
}
