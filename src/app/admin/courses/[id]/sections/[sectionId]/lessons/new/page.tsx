import PageHeader from "@/components/pageHeader";
import LessonForm from "@/features/courses/component/lessonForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string; sectionId: string };
};

export default async function NewLessonPage({ params }: Props) {
  const resolvedParams = await params;
  const courseId = resolvedParams.id;
  const sectionId = resolvedParams.sectionId;

  // Verify section and course exist
  const section = await prisma.courseSection.findFirst({
    where: { id: sectionId, courseId },
    include: { course: true },
  });

  if (!section) {
    notFound();
  }

  return (
    <div className="container my-6">
      <PageHeader title={`Add Lesson to ${section.name}`} />
      <LessonForm sectionId={sectionId} courseId={courseId} />
    </div>
  );
}