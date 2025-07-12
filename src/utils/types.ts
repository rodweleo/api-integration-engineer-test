export type ProductItem = {
  item: string;
  size: string;
  description?: string;
  tags: string[];
  onOffer: boolean;
  Price: string;
  discount: number;
};

export type PostItemRequest = {
  item: string;
  size: string;
  description?: string;
  tags: string[];
  onOffer: boolean;
  Price: string;
  discount: number;
  requestId: string;
  storeId: string;
};

export type Store = {
  id: string;
  name: string;
  created_at: string;
};

export type StoreItem = {
  id: string;
  item: string;
  size: string;
  description?: string;
  tags: string[];
  onOffer: boolean;
  Price: string;
  discount: number;
  store_id: string;
  created_at: string;
};

export type LogProcessedRequestResponse = {
  id: string;
  requestId: string;
  requestData: {};
  responseData: {};
  created_at: string;
};
