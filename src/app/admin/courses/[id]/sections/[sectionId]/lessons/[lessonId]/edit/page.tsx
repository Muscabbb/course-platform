import PageHeader from "@/components/pageHeader";
import EditLessonForm from "@/features/courses/component/editLessonForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string; sectionId: string; lessonId: string };
};

export default async function EditLessonPage({ params }: Props) {
  const resolvedParams = await params;
  const courseId = resolvedParams.id;
  const sectionId = resolvedParams.sectionId;
  const lessonId = resolvedParams.lessonId;

  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, sectionId },
  });

  if (!lesson) {
    notFound();
  }

  // Verify the section belongs to the course
  const section = await prisma.courseSection.findFirst({
    where: { id: sectionId, courseId },
  });

  if (!section) {
    notFound();
  }

  return (
    <div className="container my-6">
      <PageHeader title={`Edit Lesson: ${lesson.name}`} />
      <EditLessonForm lesson={lesson} courseId={courseId} />
    </div>
  );
}