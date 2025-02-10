import PageHeader from "@/components/pageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function CoursesPage() {
  return (
    <div className="container my-6">
      <PageHeader title="courses">
        <Button className="capitalize" asChild>
          <Link href={"admin/courses/new"}>new course</Link>
        </Button>
      </PageHeader>
    </div>
  );
}
