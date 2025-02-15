"use server";

import { courseSchema } from "@/features/schemas/courseSchema";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function createCourse(data: z.infer<typeof courseSchema>) {
  const course = await prisma.course.create({
    data: {
      name: data.name,
      description: data.description,
    },
  });

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
