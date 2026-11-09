import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1).max(10)
    })).min(1).max(20)
  })
});
export const paymentSchema = z.object({
  body: z.object({
    method: z.enum(["QRIS", "DANA", "GOPAY"])
  }),
  params: z.object({ id: z.string().min(1) })
});
