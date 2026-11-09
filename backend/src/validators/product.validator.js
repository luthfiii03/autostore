import { z } from "zod";

const productFields = {
  body: z.object({
    categoryId: z.string().min(1),
    name: z.string().trim().min(2).max(160),
    slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string().max(5000).optional(),
    imageUrl: z.string().url().optional(),
    price: z.coerce.number().positive(),
    isActive: z.boolean().optional()
};
export const productSchema = z.object({ body: z.object(productFields) });
export const updateProductSchema = z.object({
  body: z.object(productFields).partial().refine((value) => Object.keys(value).length > 0, "Minimal satu field harus diisi"),
  params: z.object({ id: z.string().min(1) })
});
