import z from "zod";

export const itemSchema = z.object({
  requestId: z.string().min(1, "Missing field 'requestId'"),
  item: z.string().min(1, "Missing field 'item'"),
  size: z.string().min(1, "Missing field 'size'"),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  onOffer: z.boolean(),
  Price: z.preprocess((val) => {
    if (typeof val === "string") return parseFloat(val);
    return val;
  }, z.number().positive("Price must be a positive number")),
  discount: z.number().min(0, "Missing field 'discount'"),
});

export const createStoreSchema = z.object({
  name: z
    .string()
    .min(1, "Store name is required")
    .max(100, "Store name must be less than 100 characters"),
});
