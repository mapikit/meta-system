export class ResultNotFoundError extends Error {
  constructor (sourceModuleKey : number, target : string) {
    super(`Target "${target}" expected the results from module with key ${sourceModuleKey},
        which has not been executed yet`);
  }
}
