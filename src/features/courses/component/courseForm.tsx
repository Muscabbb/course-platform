"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema } from "@/features/schemas/courseSchema";
import { z } from "zod";
import CustomForm from "@/components/cusntomForm";
import { FormFieldType } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DessertIcon, LeafIcon, Loader } from "lucide-react";
import { createCourse } from "../db/course";

export default function CourseForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof courseSchema>) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Submitted");

    try {
      await createCourse(data);
    } catch (error) {
      console.log(error);
    }
    form.reset();
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CustomForm
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="name"
          label="Course Name"
          icon={<LeafIcon />}
        />
        <CustomForm
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="description"
          label="Course Description"
          icon={<DessertIcon />}
        />
        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="ml-auto disabled:bg-gray-600"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader className="h-4 w-4" />
              <span>Submitting...</span>
            </div>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
}
