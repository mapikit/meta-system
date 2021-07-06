import { TTLExceededError } from "src/bops-functions/bops-engine/engine-errors/execution-time-exceeded";

// eslint-disable-next-line max-lines-per-function
export function addTimeout (timeoutMs : number, promise : Function) : Function {
  let timeoutHandle : NodeJS.Timeout;

  const result = (inputs : unknown) : Promise<unknown> => {
    const timeoutPromise = new Promise((_resolve, reject) => {
      timeoutHandle = setTimeout(() => reject(new TTLExceededError(timeoutMs)), timeoutMs);
    });

    return Promise.race([
      timeoutPromise,
      promise(inputs),
    ]).then((res) => {
      clearTimeout(timeoutHandle);
      return res;
    });
  };

  return result;
};
