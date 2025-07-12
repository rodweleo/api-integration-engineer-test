import { PostgrestError } from "@supabase/supabase-js";
import { supabaseClient } from "../utils/supabase";
import {
  PostItemRequest,
  ProductItem,
  Store,
  StoreItem,
  CreateStoreRequest,
} from "../utils/types";

class StoreService {
  constructor() {}

  public async getAllStores(): Promise<Store[] | null> {
    const { data, error } = await supabaseClient
      .from("test_store_stores")
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return null;
    }

    return data;
  }

  public async getStoreById(storeId: string): Promise<{
    data: Store | null;
    error: PostgrestError | null;
  }> {
    const { data, error } = await supabaseClient
      .from("test_store_stores")
      .select("*")
      .eq("id", storeId)
      .single();

    if (error) {
      return {
        data: null,
        error,
      };
    }

    if (!data) {
      return {
        data: null,
        error,
      };
    }

    return {
      data,
      error: null,
    };
  }

  public async createStore(storeData: CreateStoreRequest): Promise<{
    data: {
      storeId: string;
      message: string;
    } | null;
    error: PostgrestError | null;
  }> {
    // Check if store with same name already exists
    const { data: existingStore, error: checkError } = await supabaseClient
      .from("test_store_stores")
      .select("id")
      .eq("name", storeData.name)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      return {
        data: null,
        error: checkError,
      };
    }

    if (existingStore) {
      return {
        data: null,
        error: {
          message: "Store with this name already exists",
          details: "A store with the same name already exists in the system",
          hint: "Please use a different store name",
          code: "23505",
        } as PostgrestError,
      };
    }

    const { data, error } = await supabaseClient
      .from("test_store_stores")
      .insert({
        name: storeData.name,
      })
      .select("id");

    if (error) {
      return {
        data: null,
        error,
      };
    }

    if (!data || data.length === 0) {
      return { data: null, error };
    }

    return {
      data: {
        storeId: data[0].id,
        message: "Store created successfully",
      },
      error: null,
    };
  }

  public async getItemsByStoreId(storeId: string): Promise<{
    data: StoreItem[] | null;
    error: PostgrestError | null;
  }> {
    const { data, error } = await supabaseClient
      .from("test_store_items")
      .select("*")
      .eq("store_id", storeId);

    if (error) {
      return {
        data: null,
        error,
      };
    }

    return {
      data: data || [],
      error: null,
    };
  }

  public async getItemById(itemId: string): Promise<{
    data: StoreItem | null;
    error: PostgrestError | null;
  }> {
    const { data, error } = await supabaseClient
      .from("test_store_items")
      .select("*")
      .eq("id", itemId)
      .single();

    if (error) {
      return {
        data: null,
        error,
      };
    }

    return {
      data,
      error: null,
    };
  }

  public async deleteItem(itemId: string): Promise<{
    error: PostgrestError | null;
  }> {
    const { error } = await supabaseClient
      .from("test_store_items")
      .delete()
      .eq("id", itemId);

    return {
      error,
    };
  }

  public async postItem(item: PostItemRequest): Promise<{
    data: {
      itemCode: string;
      message: string;
    } | null;
    error: PostgrestError | null;
  }> {
    const { data, error } = await supabaseClient
      .from("test_store_items")
      .insert({
        item: item.item,
        size: item.size,
        description: item.description,
        tags: item.tags,
        onOffer: item.onOffer,
        Price: item.Price,
        discount: item.discount,
        request_id: item.requestId,
        store_id: item.storeId,
      })
      .select("id");

    if (error) {
      return {
        data: null,
        error,
      };
    }

    if (!data || data.length === 0) {
      return { data: null, error };
    }

    const itemCode = data[0].id;
    return {
      data: {
        itemCode: itemCode,
        message: "Item created successfully",
      },
      error: null,
    };
  }
}

export default StoreService;
