import { sleep } from "./sleep";

// eslint-disable-next-line max-lines-per-function
export const retry = async (exec : Function, limit : number) : Promise<void> => {
  console.log("Scheduling execution of retryable function - Limit: ", limit);

  let attempt = 1;
  let lastError = "NO ERROR PROVIDED";
  while (attempt < limit) {
    console.log("Attempt to execute: ", attempt);

    try {
      await exec();
      break;
    } catch (error) {
      await sleep(2000);
      attempt ++;
      lastError = error;
    }
  }

  throw lastError;
};
