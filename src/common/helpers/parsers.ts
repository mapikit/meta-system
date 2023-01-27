export function parseInteger (value : string) : number {
  const parsedValue = parseInt(value);
  if(isNaN(parsedValue)) throw Error(`${value} is not a valid integer`);
  if(Number(value) !== parsedValue) console.warn(`${value} will be truncated to an integer`);
  return parsedValue;
}
