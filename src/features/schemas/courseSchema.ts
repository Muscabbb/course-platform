import { z } from "zod";

export const courseSchema = z.object({
  name: z
    .string()
    .min(1, "Course name is required")
    .max(255, "Course name must be less than 255 characters"),
  description: z
    .string()
    .min(1, "Course description is required")
    .max(1000, "Course description must be less than 1000 characters"),
});
