export const anyIsNan = (...values : number[]) : boolean => {
  for (const value of values) {
    if (Number.isNaN(Number(value))) { return true; }
  }
};
