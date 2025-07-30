import { z } from "zod";

export const sectionSchema = z.object({
  name: z
    .string()
    .min(1, "Section name is required")
    .max(255, "Section name must be less than 255 characters"),
  order: z.number().min(0, "Order must be a positive number"),
  status: z.enum(["private", "public"]),
  courseId: z.string().min(1, "Course ID is required"),
});

export const lessonSchema = z.object({
  name: z
    .string()
    .min(1, "Lesson name is required")
    .max(255, "Lesson name must be less than 255 characters"),
  description: z.string().optional(),
  videoUrl: z.string().url("Invalid video URL"),
  duration: z.number().min(1, "Duration must be greater than 0"),
  order: z.number().min(0, "Order must be a positive number"),
  status: z.enum(["private", "public", "preview"]),
  sectionId: z.string().min(1, "Section ID is required"),
});