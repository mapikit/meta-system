import { TTLExceededError } from "./engine-errors/execution-time-exceeded";

export function addTimeout (timeoutMs : number, promise : Function) : Function {
  let timeoutHandle : NodeJS.Timeout;
  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutHandle = setTimeout(() => reject(new TTLExceededError(timeoutMs)), timeoutMs);
  });

  return async function (inputs : unknown) : Promise<unknown> {
    return Promise.race([
      timeoutPromise,
      promise(inputs),
    ]).then((res) => {
      clearTimeout(timeoutHandle);
      return res;
    });
  };
};
