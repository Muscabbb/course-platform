import { z } from "zod";
export const courseSchema = z.object({
  name: z.string().min(3, "Required").max(255),
  description: z.string().min(3, "Required").max(255),
});
