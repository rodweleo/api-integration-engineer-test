import { PostgrestError } from "@supabase/supabase-js";
import { supabaseClient } from "../utils/supabase";
import { PostItemRequest, ProductItem, Store } from "../utils/types";

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
}

export default StoreService;
