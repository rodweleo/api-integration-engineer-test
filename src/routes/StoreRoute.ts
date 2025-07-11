import express from "express";
import { itemSchema } from "../utils/schemas";
import { generateRequestId } from "../utils/helpers";
import {StoreService} from "../services";

const StoreRoute = express.Router();

StoreRoute.post("/:storeID/postitem", async (req, res) => {
  const { storeID } = req.params;

  const { error } = itemSchema.safeParse(req.body);

  if (error) {
    return res
      .status(400)
      .json({
        requestId: generateRequestId(),
        errorCode: "400",
        Description: error.message,
      });
  }

  try{
    const storeService = new StoreService();
    const result = await storeService.postItem(req.body);

    return res.status(201).json({
        requestId: generateRequestId(),
        itemCode: result.itemCode,
        Description: result.message,
    });
  }catch(e: any){
    return res.status(500).json({
        requestId: generateRequestId(),
        errorCode: "500",
        Description: e.message,
    });
  }
});

export default StoreRoute
