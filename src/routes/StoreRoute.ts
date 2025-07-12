import express from "express";
import { itemSchema, createStoreSchema } from "../utils/schemas";
import { generateRequestId } from "../utils/helpers";
import { StoreService } from "../services";
import { supabaseClient } from "../utils/supabase";
import LogService from "../services/LogService";

const StoreRoute = express.Router();
const storeService = new StoreService();
const logService = new LogService();

// Create a new store
StoreRoute.post("/stores/create", async (req, res) => {
  const requestId = generateRequestId();

  // Validate the inputs using zod
  const { error } = createStoreSchema.safeParse(req.body);

  if (error) {
    return res.status(400).json({
      requestId,
      errorCode: "04XY",
      Description: error.message,
    });
  }

  try {
    const { data, error } = await storeService.createStore(req.body);

    if (error) {
      if (error.code === "23505" || error.message?.includes("already exists")) {
        return res.status(409).json({
          requestId,
          errorCode: "49XY",
          Description: "Store with this name already exists",
        });
      }

      return res.status(500).json({
        requestId,
        errorCode: "50XY",
        Description: error.message || "Failed to create store",
      });
    }

    if (!data) {
      return res.status(500).json({
        requestId,
        errorCode: "50XY",
        Description: "Failed to create store",
      });
    }

    // Log the processed request
    await logService.logProcessedRequest({
      requestId,
      requestData: req.body,
      responseData: data,
    });

    return res.status(201).json({
      requestId,
      storeId: data.storeId,
      Description: data.message,
    });
  } catch (e: any) {
    return res.status(500).json({
      requestId: requestId,
      errorCode: "50XY",
      Description: e.message || "Internal server error",
    });
  }
});

// Get all stores
StoreRoute.get("/stores/all", async (req, res) => {
  try {
    const stores = await storeService.getAllStores();

    if (!stores) {
      return res.status(200).json([]);
    }

    res.status(200).json(stores);
  } catch (error: any) {
    res.status(500).json({
      requestId: generateRequestId(),
      errorCode: "50XY",
      Description: error.message || "Internal server error",
    });
  }
});

// Get store by ID
StoreRoute.get("/stores/:storeID", async (req, res) => {
  const { storeID } = req.params;

  try {
    const { data, error } = await storeService.getStoreById(storeID);

    if (error || !data) {
      return res.status(404).json({
        requestId: generateRequestId(),
        errorCode: "44XY",
        Description: "Store not found",
      });
    }

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({
      requestId: generateRequestId(),
      errorCode: "50XY",
      Description: error.message || "Internal server error",
    });
  }
});

// Get all items for a store
StoreRoute.get("/stores/:storeID/items", async (req, res) => {
  const { storeID } = req.params;

  try {
    // First check if store exists
    const { data: storeData, error: storeError } =
      await storeService.getStoreById(storeID);

    if (storeError || !storeData) {
      return res.status(404).json({
        requestId: generateRequestId(),
        errorCode: "44XY",
        Description: "Store not found",
      });
    }

    // Get items for the store
    const { data: items, error: itemsError } =
      await storeService.getItemsByStoreId(storeID);

    if (itemsError) {
      return res.status(500).json({
        requestId: generateRequestId(),
        errorCode: "50XY",
        Description: itemsError.message,
      });
    }

    res.status(200).json(items || []);
  } catch (error: any) {
    res.status(500).json({
      requestId: generateRequestId(),
      errorCode: "50XY",
      Description: error.message || "Internal server error",
    });
  }
});

// Delete an item from a store
StoreRoute.delete("/stores/:storeID/items/:itemCode", async (req, res) => {
  const { storeID, itemCode } = req.params;

  try {
    // First check if store exists
    const { data: storeData, error: storeError } =
      await storeService.getStoreById(storeID);

    if (storeError || !storeData) {
      return res.status(404).json({
        requestId: generateRequestId(),
        errorCode: "44XY",
        Description: "Store not found",
      });
    }

    // Check if item exists and belongs to the store
    const { data: itemData, error: itemError } = await storeService.getItemById(
      itemCode
    );

    if (itemError || !itemData) {
      return res.status(404).json({
        requestId: generateRequestId(),
        errorCode: "44XY",
        Description: "Item not found",
      });
    }

    if (itemData.store_id !== storeID) {
      return res.status(404).json({
        requestId: generateRequestId(),
        errorCode: "44XY",
        Description: "Item not found in this store",
      });
    }

    // Delete the item
    const { error: deleteError } = await storeService.deleteItem(itemCode);

    if (deleteError) {
      return res.status(500).json({
        requestId: generateRequestId(),
        errorCode: "50XY",
        Description: deleteError.message,
      });
    }

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({
      requestId: generateRequestId(),
      errorCode: "50XY",
      Description: error.message || "Internal server error",
    });
  }
});

// Handle unsupported methods for the postitem endpoint
StoreRoute.all("/:storeID/postitem", (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      requestId: req.body?.requestId || "unknown",
      errorCode: "45XY",
      Description: "method not allowed",
    });
  }
});

StoreRoute.post("/:storeID/postitem", async (req, res) => {
  const { storeID } = req.params;
  const { requestId } = req.body;

  const requestIdDetails = await logService.getRequestById(requestId);
  if (requestIdDetails.data) {
    return res.status(503).json({
      requestId: requestId,
      errorCode: "53QW",
      Description: "duplicate requestID",
    });
  }

  //check if the store is registered
  const storeRes = await storeService.getStoreById(storeID);

  if (!storeRes.data) {
    return res.status(404).json({
      requestId: requestId,
      errorCode: "44XY",
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
      itemCode: data.itemCode,
      Description: data.message,
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
