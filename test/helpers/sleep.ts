export const sleep = async (durationMs : number) : Promise<void> => {
  return new Promise((resolve) => {
    console.log(`\nSleeping for ${durationMs}ms...\n`);
    setTimeout(resolve, durationMs);
  });
};
