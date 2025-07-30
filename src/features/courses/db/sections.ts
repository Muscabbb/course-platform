"use server";

import { sectionSchema, lessonSchema } from "@/features/schemas/sectionSchema";
import { prisma } from "@/lib/prisma";
import { canCreate } from "@/permissions/course";
import { getCurrentUser } from "@/services/clerk";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Section functions
export async function createSection(unSafeData: z.infer<typeof sectionSchema>) {
  const { success, data } = sectionSchema.safeParse(unSafeData);

  if (!success || !canCreate(await getCurrentUser()))
    return { error: true, message: "There was an error creating the section!" };

  const section = await prisma.courseSection.create({ data });
  revalidatePath(`/admin/courses/${data.courseId}`);
  return section;
}

export async function updateSection(
  id: string,
  unSafeData: z.infer<typeof sectionSchema>
) {
  const { success, data } = sectionSchema.safeParse(unSafeData);

  if (!success || !canCreate(await getCurrentUser()))
    return { error: true, message: "There was an error updating the section!" };

  const section = await prisma.courseSection.update({ where: { id }, data });
  revalidatePath(`/admin/courses/${data.courseId}`);
  return section;
}

export async function deleteSection(id: string) {
  if (!canCreate(await getCurrentUser()))
    return { error: true, message: "Unauthorized" };

  const section = await prisma.courseSection.findFirst({ where: { id } });
  if (!section) return { error: true, message: "Section not found" };

  await prisma.courseSection.delete({ where: { id } });
  revalidatePath(`/admin/courses/${section.courseId}`);
  return { success: true };
}

// Lesson functions
export async function createLesson(unSafeData: z.infer<typeof lessonSchema>) {
  const { success, data } = lessonSchema.safeParse(unSafeData);

  if (!success || !canCreate(await getCurrentUser()))
    return { error: true, message: "There was an error creating the lesson!" };

  const lesson = await prisma.lesson.create({ data });
  
  // Get section to revalidate course page
  const section = await prisma.courseSection.findFirst({ where: { id: data.sectionId } });
  if (section) {
    revalidatePath(`/admin/courses/${section.courseId}`);
  }
  
  return lesson;
}

export async function updateLesson(
  id: string,
  unSafeData: z.infer<typeof lessonSchema>
) {
  const { success, data } = lessonSchema.safeParse(unSafeData);

  if (!success || !canCreate(await getCurrentUser()))
    return { error: true, message: "There was an error updating the lesson!" };

  const lesson = await prisma.lesson.update({ where: { id }, data });
  
  // Get section to revalidate course page
  const section = await prisma.courseSection.findFirst({ where: { id: data.sectionId } });
  if (section) {
    revalidatePath(`/admin/courses/${section.courseId}`);
  }
  
  return lesson;
}

export async function deleteLesson(id: string) {
  if (!canCreate(await getCurrentUser()))
    return { error: true, message: "Unauthorized" };

  const lesson = await prisma.lesson.findFirst({ 
    where: { id },
    include: { section: true }
  });
  
  if (!lesson) return { error: true, message: "Lesson not found" };

  await prisma.lesson.delete({ where: { id } });
  revalidatePath(`/admin/courses/${lesson.section.courseId}`);
  return { success: true };
}

// Get functions
export async function getSectionsByCourse(courseId: string) {
  return await prisma.courseSection.findMany({
    where: { courseId },
    include: {
      lessons: {
        orderBy: { order: "asc" }
      }
    },
    orderBy: { order: "asc" }
  });
}

export async function getLessonsBySection(sectionId: string) {
  return await prisma.lesson.findMany({
    where: { sectionId },
    orderBy: { order: "asc" }
  });
}