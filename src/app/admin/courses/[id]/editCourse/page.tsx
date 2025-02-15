import PageHeader from "@/components/pageHeader";
import EditCourseForm from "@/features/courses/component/editCourse";
import { prisma } from "@/lib/prisma";
import { Course } from "@prisma/client";

type Props = {
  params: { id: string };
};

export default async function EditPage({ params }: Props) {
  const resolvedParams = await params;
  const course = await prisma.course.findFirst({
    where: { id: resolvedParams.id },
  });

  return (
    <div className="container my-6">
      <PageHeader title="Edit Course" />
      <EditCourseForm course={course as Course} />
    </div>
  );
}
