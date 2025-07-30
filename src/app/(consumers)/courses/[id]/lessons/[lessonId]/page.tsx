import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/services/clerk";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, PlayIcon, CheckCircle } from "lucide-react";
import Link from "next/link";
import { LessonCompleteButton } from "@/features/courses/component/lessonCompleteButton";

type Props = {
  params: { id: string; lessonId: string };
};

export default async function LessonPage({ params }: Props) {
  const resolvedParams = await params;
  const courseId = resolvedParams.id;
  const lessonId = resolvedParams.lessonId;
  const user = await getCurrentUser();

  // Get lesson with section and course info
  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId },
    include: {
      section: {
        include: {
          course: {
            include: {
              users: true,
              sections: {
                include: {
                  lessons: {
                    orderBy: { order: "asc" },
                  },
                },
                orderBy: { order: "asc" },
              },
            },
          },
        },
      },
      usersComplete: {
        where: {
          userId: user?.id || "",
        },
      },
    },
  });

  if (!lesson || lesson.section.course.id !== courseId) {
    notFound();
  }

  const course = lesson.section.course;
  const isEnrolled = user ? course.users.some(u => u.userId === user.id) : false;
  const canAccess = isEnrolled || lesson.status === "preview";

  if (!canAccess) {
    redirect(`/courses/${courseId}`);
  }

  // Get all lessons in order for navigation
  const allLessons = course.sections.flatMap(section => 
    section.lessons.map(l => ({ ...l, sectionName: section.name }))
  );
  
  const currentIndex = allLessons.findIndex(l => l.id === lessonId);
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  
  const isCompleted = lesson.usersComplete.length > 0;

  return (
    <div className="container my-8">
      {/* Navigation */}
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link href={`/courses/${courseId}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Link>
        </Button>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href={`/courses/${courseId}`} className="hover:text-foreground">
            {course.name}
          </Link>
          <span>/</span>
          <span>{lesson.section.name}</span>
          <span>/</span>
          <span className="text-foreground">{lesson.name}</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Video Player */}
          <Card className="mb-6">
            <CardContent className="p-0">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                {lesson.videoUrl ? (
                  <iframe
                    src={lesson.videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title={lesson.name}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <PlayIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Video not available</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lesson Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{lesson.name}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{lesson.section.name}</span>
                    <span>•</span>
                    <span>{Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')} minutes</span>
                    {lesson.status === "preview" && (
                      <>
                        <span>•</span>
                        <Badge variant="outline">Preview</Badge>
                      </>
                    )}
                  </div>
                </div>
                
                {isEnrolled && (
                  <div className="flex items-center gap-2">
                    {isCompleted && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Completed</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            {lesson.description && (
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{lesson.description}</p>
                  
                  {/* Lesson Complete Button */}
                  <LessonCompleteButton
                    lessonId={lessonId}
                    isCompleted={isCompleted}
                    isEnrolled={isEnrolled}
                  />
                </div>
              </CardContent>
            )}
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {previousLesson ? (
              <Button asChild variant="outline">
                <Link href={`/courses/${courseId}/lessons/${previousLesson.id}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous: {previousLesson.name}
                </Link>
              </Button>
            ) : (
              <div></div>
            )}
            
            {nextLesson ? (
              <Button asChild>
                <Link href={`/courses/${courseId}/lessons/${nextLesson.id}`}>
                  Next: {nextLesson.name}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href={`/courses/${courseId}`}>
                  Back to Course
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar - Course Navigation */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Course Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.sections.map((section) => (
                <div key={section.id}>
                  <h4 className="font-medium text-sm mb-2">{section.name}</h4>
                  <div className="space-y-1">
                    {section.lessons.map((sectionLesson) => {
                      const isCurrent = sectionLesson.id === lessonId;
                      const canAccessLesson = isEnrolled || sectionLesson.status === "preview";
                      
                      return (
                        <div key={sectionLesson.id}>
                          {canAccessLesson ? (
                            <Link
                              href={`/courses/${courseId}/lessons/${sectionLesson.id}`}
                              className={`block p-2 text-sm rounded hover:bg-muted/50 transition-colors ${
                                isCurrent ? "bg-muted font-medium" : ""
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {isCurrent ? (
                                  <PlayIcon className="w-3 h-3 text-blue-600" />
                                ) : (
                                  <div className="w-3 h-3 rounded-full border border-muted-foreground" />
                                )}
                                <span className="truncate">{sectionLesson.name}</span>
                                {sectionLesson.status === "preview" && (
                                  <Badge variant="outline" className="text-xs ml-auto">
                                    Preview
                                  </Badge>
                                )}
                              </div>
                            </Link>
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground opacity-60">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full border border-muted-foreground" />
                                <span className="truncate">{sectionLesson.name}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}