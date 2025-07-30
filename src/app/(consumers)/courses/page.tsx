import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/services/clerk";
import { redirect } from "next/navigation";
import { GraduationCap, Clock, CheckCircle, PlayCircle } from "lucide-react";
import Link from "next/link";

export default async function MyCoursesPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  // Get user's enrolled courses with progress
  const enrolledCourses = await prisma.courseUser.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          sections: {
            include: {
              lessons: {
                include: {
                  usersComplete: {
                    where: { userId: user.id },
                  },
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
        },
      },
    },
  });

  // Calculate progress for each course
  const coursesWithProgress = enrolledCourses.map(({ course }) => {
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
    
    const totalDuration = course.sections.reduce(
      (total, section) => 
        total + section.lessons.reduce((lessonTotal, lesson) => lessonTotal + lesson.duration, 0),
      0
    );

    return {
      ...course,
      progress: {
        totalLessons,
        completedLessons,
        progressPercentage,
        totalDuration,
      },
    };
  });

  return (
    <div className="container my-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Courses</h1>
        <p className="text-muted-foreground">
          Continue your learning journey with your enrolled courses.
        </p>
      </div>

      {coursesWithProgress.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't enrolled in any courses yet. Start learning today!
            </p>
            <Button asChild>
              <Link href="/">Browse Courses</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coursesWithProgress.map((course) => {
            const product = course.products[0]?.product;
            const { progress } = course;
            
            return (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 line-clamp-2">
                        {course.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                    </div>
                    <Badge 
                      variant={course.status === "published" ? "default" : "secondary"}
                      className="ml-2"
                    >
                      {course.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{progress.progressPercentage}%</span>
                    </div>
                    <Progress value={progress.progressPercentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{progress.completedLessons} of {progress.totalLessons} lessons</span>
                      <span>
                        {progress.progressPercentage === 100 ? (
                          <span className="text-green-600 font-medium">Completed!</span>
                        ) : (
                          "In Progress"
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Course Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>{progress.totalLessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{Math.floor(progress.totalDuration / 60)}h {progress.totalDuration % 60}m</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button asChild className="w-full">
                    <Link href={`/courses/${course.id}`}>
                      {progress.progressPercentage === 100 ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Review Course
                        </>
                      ) : progress.progressPercentage > 0 ? (
                        <>
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Continue Learning
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Start Course
                        </>
                      )}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}