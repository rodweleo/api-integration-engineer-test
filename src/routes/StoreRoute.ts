import express from "express";
import { itemSchema } from "../utils/schemas";
import { generateRequestId } from "../utils/helpers";
import { StoreService } from "../services";
import { supabaseClient } from "../utils/supabase";
import LogService from "../services/LogService";

const StoreRoute = express.Router();
const storeService = new StoreService();
const logService = new LogService();

StoreRoute.get("/stores/all", async (req, res) => {
  const stores = await storeService.getAllStores();

  res.status(200).json(stores);
});
StoreRoute.post("/:storeID/postitem", async (req, res) => {
  const { storeID } = req.params;
  const { requestId } = req.body;

  const requestIdDetails = await logService.getRequestById(requestId);
  if (requestIdDetails.data) {
    return res.status(503).json({
      requestId: requestId,
      errorCode: "503",
      errorDescription: "duplicate requestID",
    });
  }

  //check if the store is registered
  const storeRes = await storeService.getStoreById(storeID);

  if (!storeRes.data) {
    return res.status(404).json({
      requestId: requestId,
      errorCode: "400",
      Description: `Store with ID ${storeID} not found`,
    });
  }

  //Validate the inputs using zod
  const { error } = itemSchema.safeParse(req.body);

  if (error) {
    return res.status(400).json({
      requestId: requestId,
      errorCode: "400",
      Description: error.message,
    });
  }

  try {
    const { data, error } = await storeService.postItem(req.body);

    if (error || !data) {
      return res.status(500).json({
        requestId: requestId,
        error: "500",
        Description: error?.message,
      });
    }

    await logService.logProcessedRequest({
      requestId,
      requestData: req.body,
      responseData: data,
    });

    return res.status(201).json({
      requestId,
      ...data,
    });
  } catch (e: any) {
    return res.status(500).json({
      requestId: requestId,
      errorCode: "500",
      Description: e.message,
    });
  }
});

export default StoreRoute;
