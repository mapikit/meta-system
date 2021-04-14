export class TTLExceededError extends Error {
  constructor (timeExecuted : number) {
    super(`Time limit reached after ${timeExecuted}ms`);
  }
}
