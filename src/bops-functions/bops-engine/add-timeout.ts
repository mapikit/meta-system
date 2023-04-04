import { logger } from "../../common/logger/logger.js";
import { TTLExceededError } from "./engine-errors/execution-time-exceeded.js";

// eslint-disable-next-line max-lines-per-function
export function addTimeout (timeoutMs : number, promise : Function) : Function {
  let timeoutHandle : NodeJS.Timeout;

  const result = async (inputs : unknown) : Promise<unknown> => {
    const timeoutPromise = new Promise((_resolve, reject) => {
      timeoutHandle = setTimeout(() => reject(new TTLExceededError(timeoutMs)), timeoutMs);
    });

    return Promise.race([
      timeoutPromise,
      promise(inputs),
    ]).then(promiseResult => {
      clearTimeout(timeoutHandle);
      return promiseResult;
    }).catch(error => {
      logger.error(error);
      return { __execError: error };
    });
  };

  return result;
};
