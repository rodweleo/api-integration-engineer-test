import { v4 as uuidv4 } from "uuid";
import { ProductItem } from "./types";

export const generateRequestId = () => {
    return uuidv4();
}

export const generateProductId = (item?: ProductItem) => {
    return uuidv4();
}