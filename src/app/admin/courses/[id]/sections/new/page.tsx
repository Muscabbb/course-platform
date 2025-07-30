import PageHeader from "@/components/pageHeader";
import SectionForm from "@/features/courses/component/sectionForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function NewSectionPage({ params }: Props) {
  const resolvedParams = await params;
  const courseId = resolvedParams.id;

  // Verify course exists
  const course = await prisma.course.findFirst({
    where: { id: courseId },
  });

  if (!course) {
    notFound();
  }

  return (
    <div className="container my-6">
      <PageHeader title={`Add Section to ${course.name}`} />
      <SectionForm courseId={courseId} />
    </div>
  );
}