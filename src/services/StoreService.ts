import { generateProductId } from "../utils/helpers";
import { ProductItem } from "../utils/types";

class StoreService {

    constructor() {} 

    public async postItem(item: ProductItem) : Promise<{
        itemCode: string,
        message: string,
    }> {
        return {
            itemCode: generateProductId(item),
            message: "Item created successfully",
        };
    }
}

export default StoreService;