import { getDecimalPlaces } from "./get-decimal-places.js";

export const getGreatestDecimalPlaces = (...numbers : number[]) : number => {
  const decimalPlacesList = numbers.map((value) => getDecimalPlaces(value));

  let greatestDecimalPlaces = 0;

  decimalPlacesList.forEach((decimalPlaces) => {
    greatestDecimalPlaces = Math.max(decimalPlaces, greatestDecimalPlaces);
  });

  return greatestDecimalPlaces;
};
