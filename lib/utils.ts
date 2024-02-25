import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getRandomSelection = (arrayOfRetrievers: string[], exclude: string[] = []) => {
  let possibleSelections = arrayOfRetrievers.filter(item => !exclude.includes(item));
  if (possibleSelections.length > 0) {
    const randomIndex = Math.floor(Math.random() * possibleSelections.length);
    return possibleSelections[randomIndex];
  } else {
    const randomIndex = Math.floor(Math.random() * arrayOfRetrievers.length);
    return arrayOfRetrievers[randomIndex];
  }
};