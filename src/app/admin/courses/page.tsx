import PageHeader from "@/components/pageHeader";
import { Button } from "@/components/ui/button";
import { CoursesTable } from "@/features/courses/component/courseTable";
import Link from "next/link";
import React from "react";
import { prisma } from "@/lib/prisma";
export default async function CoursesPage() {
  const courses = await prisma.course.findMany();
  return (
    <div className="container my-6">
      <PageHeader title="courses">
        <Button className="capitalize" asChild>
          <Link href={"/admin/courses/newCourse"}>new course</Link>
        </Button>
      </PageHeader>
      <CoursesTable courses={courses} />
    </div>
  );
}
