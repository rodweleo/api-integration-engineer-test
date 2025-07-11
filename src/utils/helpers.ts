import { v4 as uuidv4 } from "uuid";
import { ProductItem } from "./types";

export const generateRequestId = () => {
    return uuidv4();
}

export const generateProductId = (item?: ProductItem) => {
    return uuidv4();
}

export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min); // Ensure min is an integer
    max = Math.floor(max); // Ensure max is an integer
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }