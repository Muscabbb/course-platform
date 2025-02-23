import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Course name is required")
    .max(255, "Course name must be less than 255 characters"),
  description: z
    .string()
    .min(1, "Course description is required")
    .max(1000, "Course description must be less than 1000 characters"),
  imageUrl: z
    .string()
    .min(1, "product image is required")
    .max(1000, "product image must be less than 1000 characters"),
  price: z
    .number()
    .min(1, "Course price is required")
    .max(1000000, "Course price must be less than 1000000"),
  status: z.enum(["private", "public"]),
});
