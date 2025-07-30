"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lessonSchema } from "@/features/schemas/sectionSchema";
import { z } from "zod";
import CustomForm from "@/components/cusntomForm";
import { FormFieldType } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { DessertIcon, LeafIcon, Loader, PlayIcon, ClockIcon } from "lucide-react";
import { createLesson } from "../db/sections";
import { useRouter } from "next/navigation";

type Props = {
  sectionId: string;
  courseId: string;
};

export default function LessonForm({ sectionId, courseId }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof lessonSchema>>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: "",
      description: "",
      videoUrl: "",
      duration: 0,
      order: 0,
      status: "private",
      sectionId,
    },
  });

  const onSubmit = async (values: z.infer<typeof lessonSchema>) => {
    setLoading(true);
    try {
      const result = await createLesson(values);
      if (result.error) {
        toast.error(result.message);
      } else {
        toast.success("Lesson created successfully!");
        router.push(`/admin/courses/${courseId}`);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CustomForm
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="name"
          label="Lesson Name"
          icon={<LeafIcon />}
        />
        <CustomForm
          control={form.control}
          fieldType={FormFieldType.TEXTAREA}
          name="description"
          label="Description (Optional)"
          icon={<DessertIcon />}
        />
        <CustomForm
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="videoUrl"
          label="Video URL"
          icon={<PlayIcon />}
        />
        <CustomForm
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="duration"
          label="Duration (in seconds)"
          icon={<ClockIcon />}
        />
        <CustomForm
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="order"
          label="Order"
          icon={<DessertIcon />}
        />
        <CustomForm
          control={form.control}
          fieldType={FormFieldType.SELECT}
          name="status"
          label="Status"
          options={[
            { label: "Private", value: "private" },
            { label: "Public", value: "public" },
            { label: "Preview", value: "preview" },
          ]}
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
            "Create Lesson"
          )}
        </Button>
      </form>
    </Form>
  );
}