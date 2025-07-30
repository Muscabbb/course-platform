import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/services/clerk";
import { notFound } from "next/navigation";
import { GraduationCap, Users, Clock, PlayIcon, LockIcon, CheckCircle } from "lucide-react";
import Link from "next/link";
import { EnrollmentButton } from "@/features/courses/component/enrollmentButton";
import { ProgressTracker } from "@/features/courses/component/progressTracker";
import { getUserProgress } from "@/features/courses/db/enrollment";

type Props = {
  params: { id: string };
};

export default async function CourseDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const courseId = resolvedParams.id;
  const user = await getCurrentUser();

  const course = await prisma.course.findFirst({
    where: { id: courseId },
    include: {
      sections: {
        where: {
          status: "public",
        },
        include: {
          lessons: {
            where: {
              OR: [
                { status: "public" },
                { status: "preview" },
              ],
            },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
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

  if (!course) {
    notFound();
  }

  // Check if user is enrolled
  const isEnrolled = user ? course.users.some(u => u.userId === user.id) : false;
  
  // Get the product for this course
  const product = course.products[0]?.product;
  
  // Calculate course stats
  const totalLessons = course.sections.reduce(
    (acc, section) => acc + section.lessons.length,
    0
  );
  
  const totalDuration = course.sections.reduce(
    (acc, section) => 
      acc + section.lessons.reduce((lessonAcc, lesson) => lessonAcc + lesson.duration, 0),
    0
  );
  
  const enrolledCount = course.users.length;
  
  // Get user progress if enrolled
  const userProgress = isEnrolled ? await getUserProgress(courseId) : null;

  return (
    <div className="container my-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Course Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{course.name}</h1>
            <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                <span>{totalLessons} lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{Math.floor(totalDuration / 3600)}h {Math.floor((totalDuration % 3600) / 60)}m</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{enrolledCount} students enrolled</span>
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Course Content</h2>
            
            {course.sections.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No content available yet.</p>
                </CardContent>
              </Card>
            ) : (
              course.sections.map((section, sectionIndex) => (
                <Card key={section.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span>{sectionIndex + 1}. {section.name}</span>
                      <Badge variant="secondary">
                        {section.lessons.length} lessons
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {section.lessons.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        No lessons in this section yet.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {section.lessons.map((lesson, lessonIndex) => {
                          const canAccess = isEnrolled || lesson.status === "preview";
                          
                          return (
                            <div
                              key={lesson.id}
                              className={`flex items-center justify-between p-3 border rounded-lg ${
                                canAccess ? "hover:bg-muted/50" : "opacity-60"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {canAccess ? (
                                  <PlayIcon className="w-4 h-4 text-green-600" />
                                ) : (
                                  <LockIcon className="w-4 h-4 text-muted-foreground" />
                                )}
                                <div>
                                  <p className="font-medium">
                                    {lessonIndex + 1}. {lesson.name}
                                  </p>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>
                                      {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')} min
                                    </span>
                                    {lesson.status === "preview" && (
                                      <Badge variant="outline" className="text-xs">
                                        Preview
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {canAccess && (
                                <Button asChild variant="ghost" size="sm">
                                  <Link href={`/courses/${courseId}/lessons/${lesson.id}`}>
                                    {lesson.status === "preview" ? "Preview" : "Watch"}
                                  </Link>
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Progress Tracker for Enrolled Users */}
          {isEnrolled && userProgress && (
            <ProgressTracker
              totalLessons={userProgress.totalLessons}
              completedLessons={userProgress.completedLessons}
              progressPercentage={userProgress.progressPercentage}
              totalDuration={totalDuration}
            />
          )}
          
          <Card className="sticky top-6">
            <CardHeader>
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
              {product && (
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    ${(product.price / 100).toFixed(2)}
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {isEnrolled ? (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">You're enrolled!</span>
                  </div>
                  <EnrollmentButton
                    courseId={courseId}
                    isEnrolled={isEnrolled}
                    isSignedIn={!!user}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {product ? (
                    <EnrollmentButton
                      courseId={courseId}
                      isEnrolled={isEnrolled}
                      isSignedIn={!!user}
                    />
                  ) : (
                    <p className="text-center text-muted-foreground text-sm">
                      This course is not available for purchase yet.
                    </p>
                  )}
                </div>
              )}
              
              <div className="border-t pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total lessons:</span>
                  <span className="font-medium">{totalLessons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">
                    {Math.floor(totalDuration / 3600)}h {Math.floor((totalDuration % 3600) / 60)}m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Students:</span>
                  <span className="font-medium">{enrolledCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}