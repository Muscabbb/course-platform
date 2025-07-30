import PageHeader from "@/components/pageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSectionsByCourse } from "@/features/courses/db/sections";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PlusIcon, EditIcon, TrashIcon, PlayIcon } from "lucide-react";
import { DeleteSectionButton, DeleteLessonButton } from "@/features/courses/component/deleteButtons";

type Props = {
  params: { id: string };
};

export default async function CourseDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const courseId = resolvedParams.id;

  const course = await prisma.course.findFirst({
    where: { id: courseId },
    include: {
      products: {
        include: {
          product: true,
        },
      },
      users: {
        include: {
          user: true,
        },
      },
    },
  });

  const sections = await getSectionsByCourse(courseId);

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="container my-6">
      <PageHeader title={course.name}>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/admin/courses/${courseId}/editCourse`}>
              <EditIcon className="w-4 h-4 mr-2" />
              Edit Course
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/courses/${courseId}/sections/new`}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Section
            </Link>
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-6">
        {/* Course Info */}
        <Card>
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="text-muted-foreground">{course.description}</p>
              </div>
              <div>
                <h3 className="font-semibold">Enrolled Users</h3>
                <p className="text-muted-foreground">{course.users.length} users</p>
              </div>
              <div>
                <h3 className="font-semibold">Associated Products</h3>
                <div className="flex gap-2 flex-wrap">
                  {course.products.map((cp) => (
                    <Badge key={cp.id} variant="secondary">
                      {cp.product.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sections and Lessons */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Course Content</h2>
          </div>

          {sections.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">
                  No sections created yet. Start by adding your first section.
                </p>
                <Button asChild>
                  <Link href={`/admin/courses/${courseId}/sections/new`}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add First Section
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            sections.map((section, sectionIndex) => (
              <Card key={section.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle>
                        {sectionIndex + 1}. {section.name}
                      </CardTitle>
                      <Badge variant={section.status === "public" ? "default" : "secondary"}>
                        {section.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/courses/${courseId}/sections/${section.id}/lessons/new`}>
                          <PlusIcon className="w-4 h-4 mr-1" />
                          Add Lesson
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/courses/${courseId}/sections/${section.id}/edit`}>
                          <EditIcon className="w-4 h-4" />
                        </Link>
                      </Button>
                      <DeleteSectionButton sectionId={section.id} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {section.lessons.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No lessons in this section yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <PlayIcon className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">
                                {lessonIndex + 1}. {lesson.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')} minutes
                              </p>
                            </div>
                            <Badge variant={lesson.status === "public" ? "default" : lesson.status === "preview" ? "outline" : "secondary"}>
                              {lesson.status}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/admin/courses/${courseId}/sections/${section.id}/lessons/${lesson.id}/edit`}>
                                <EditIcon className="w-4 h-4" />
                              </Link>
                            </Button>
                            <DeleteLessonButton lessonId={lesson.id} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}