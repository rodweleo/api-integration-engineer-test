import { PostgrestError } from "@supabase/supabase-js";
import { supabaseClient } from "../utils/supabase";
import { LogProcessedRequestResponse } from "../utils/types";

class LogService {
  constructor() {}

  public async logProcessedRequest({
    requestId,
    requestData,
    responseData,
  }: {
    requestId: string;
    requestData: {};
    responseData: {};
  }): Promise<{
    data: LogProcessedRequestResponse | null;
    error: PostgrestError | null;
  }> {
    const { data, error } = await supabaseClient
      .from("test_store_processed_requests")
      .insert({
        request_id: requestId,
        request_data: requestData,
        response_data: responseData,
      })
      .select("*")
      .single();

    if (error) {
      console.error("[Failed to log request]:", error);
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

  public async getRequestById(requestId: string): Promise<{
    data: LogProcessedRequestResponse | null;
    error: PostgrestError | null;
  }> {
    const { data, error } = await supabaseClient
      .from("test_store_processed_requests")
      .select("*")
      .eq("request_id", requestId)
      .maybeSingle();

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

export default LogService;
