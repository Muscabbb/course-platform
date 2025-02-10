"use client";
import React from "react";
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema } from "@/features/schemas/courseSchema";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function CourseForm() {
  const form = useForm({
    resolver: zodResolver(courseSchema),
  });

  return (
    <Form>
      <FormField
        control={form.control}
        name="courseForm"
        render={({ field }) => <Input {...field} />}
      />
    </Form>
  );
}
