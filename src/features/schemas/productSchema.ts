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
  imageUrl: z.union([
    z.string().url("Invalid url"),
    z.string().startsWith("/", "Invalid url"),
  ]),
  price: z
    .number()
    .min(1, "Course price is required")
    .max(1000000, "Course price must be less than 1000000"),
  status: z.enum(["private", "public"]),
  courseId: z.array(z.string().min(1, "Course id is required")),
});
