import PageHeader from "@/components/pageHeader";
import CourseForm from "@/features/courses/component/courseForm";
import React from "react";

export default function NewCoursePage() {
  return (
    <div className="container my-6">
      <PageHeader title="New Course" />
      <CourseForm />
    </div>
  );
}
