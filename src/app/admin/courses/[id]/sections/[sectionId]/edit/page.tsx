import PageHeader from "@/components/pageHeader";
import EditSectionForm from "@/features/courses/component/editSectionForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string; sectionId: string };
};

export default async function EditSectionPage({ params }: Props) {
  const resolvedParams = await params;
  const courseId = resolvedParams.id;
  const sectionId = resolvedParams.sectionId;

  const section = await prisma.courseSection.findFirst({
    where: { id: sectionId, courseId },
    include: { course: true },
  });

  if (!section) {
    notFound();
  }

  return (
    <div className="container my-6">
      <PageHeader title={`Edit Section: ${section.name}`} />
      <EditSectionForm section={section} />
    </div>
  );
}