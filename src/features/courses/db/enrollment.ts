"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/services/clerk";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function enrollInCourse(courseId: string) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  try {
    // Check if user is already enrolled
    const existingEnrollment = await prisma.courseUser.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new Error("Already enrolled in this course");
    }

    // Check if course exists and is published
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        status: "published",
      },
    });

    if (!course) {
      throw new Error("Course not found or not available");
    }

    // Create enrollment
    await prisma.courseUser.create({
      data: {
        userId: user.id,
        courseId: courseId,
      },
    });

    revalidatePath(`/courses/${courseId}`);
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Enrollment error:", error);
    throw error;
  }
}

export async function unenrollFromCourse(courseId: string) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  try {
    await prisma.courseUser.delete({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        },
      },
    });

    revalidatePath(`/courses/${courseId}`);
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Unenrollment error:", error);
    throw error;
  }
}

export async function markLessonComplete(lessonId: string) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  try {
    // Check if user is enrolled in the course
    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId },
      include: {
        section: {
          include: {
            course: {
              include: {
                users: {
                  where: { userId: user.id },
                },
              },
            },
          },
        },
      },
    });

    if (!lesson || lesson.section.course.users.length === 0) {
      throw new Error("Not enrolled in this course");
    }

    // Check if already completed
    const existingCompletion = await prisma.lessonUser.findUnique({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lessonId,
        },
      },
    });

    if (existingCompletion) {
      return { success: true };
    }

    // Mark as complete
    await prisma.lessonUser.create({
      data: {
        userId: user.id,
        lessonId: lessonId,
      },
    });

    revalidatePath(`/courses/${lesson.section.course.id}`);
    revalidatePath(`/courses/${lesson.section.course.id}/lessons/${lessonId}`);
    
    return { success: true };
  } catch (error) {
    console.error("Mark lesson complete error:", error);
    throw error;
  }
}

export async function getUserProgress(courseId: string) {
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }

  try {
    const course = await prisma.course.findFirst({
      where: { id: courseId },
      include: {
        sections: {
          include: {
            lessons: {
              include: {
                usersComplete: {
                  where: { userId: user.id },
                },
              },
            },
          },
        },
        users: {
          where: { userId: user.id },
        },
      },
    });

    if (!course || course.users.length === 0) {
      return null;
    }

    const totalLessons = course.sections.reduce(
      (total, section) => total + section.lessons.length,
      0
    );
    
    const completedLessons = course.sections.reduce(
      (total, section) => 
        total + section.lessons.filter(lesson => lesson.usersComplete.length > 0).length,
      0
    );

    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      totalLessons,
      completedLessons,
      progressPercentage,
    };
  } catch (error) {
    console.error("Get user progress error:", error);
    return null;
  }
}