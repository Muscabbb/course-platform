"use server";

import { courseSchema } from "@/features/schemas/courseSchema";
import { prisma } from "@/lib/prisma";
import { canCreateCourse } from "@/permissions/course";
import { getCurrentUser } from "@/services/clerk";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function createCourse(unSafeData: z.infer<typeof courseSchema>) {
  const { success, data } = courseSchema.safeParse(unSafeData);

  if (!success || !canCreateCourse(await getCurrentUser()))
    return { error: true, message: "there was an error creating the course!" };

  const course = await prisma.course.create({ data });

  if (course) {
    redirect("/admin/courses");
  }

  return course;
}

export async function updateCourse(
  id: string,
  data: z.infer<typeof courseSchema>
) {
  const course = await prisma.course.update({ where: { id }, data });
  if (course) {
    redirect("/admin/courses");
  }

  return course;
}

export async function deleteCourse(id: string) {
  const course = await prisma.course.delete({ where: { id } });
  if (course) {
    redirect("/admin/courses");
  }

  return course;
}
