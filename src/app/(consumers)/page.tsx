import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { GraduationCap, Users, Clock } from "lucide-react";

export default async function Home() {
  // Get public products with their courses
  const products = await prisma.product.findMany({
    where: {
      status: "public",
    },
    include: {
      Courses: {
        include: {
          course: {
            include: {
              sections: {
                include: {
                  lessons: true,
                },
              },
              users: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container my-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Courser</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Discover amazing courses and expand your knowledge
        </p>
      </div>

      {/* Featured Courses */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
        
        {products.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No courses available yet</h3>
              <p className="text-muted-foreground">
                Check back soon for exciting new courses!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const course = product.Courses[0]?.course;
              if (!course) return null;
              
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

              return (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                      <GraduationCap className="w-12 h-12 text-white" />
                    </div>
                    <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <GraduationCap className="w-4 h-4" />
                        <span>{totalLessons} lessons</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{Math.floor(totalDuration / 3600)}h {Math.floor((totalDuration % 3600) / 60)}m</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{enrolledCount} enrolled</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">
                        ${(product.price / 100).toFixed(2)}
                      </div>
                      <Button asChild>
                        <Link href={`/courses/${course.id}`}>
                          View Course
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
