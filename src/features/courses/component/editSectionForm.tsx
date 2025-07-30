"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sectionSchema } from "@/features/schemas/sectionSchema";
import { z } from "zod";
import CustomForm from "@/components/cusntomForm";
import { FormFieldType } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { DessertIcon, LeafIcon, Loader } from "lucide-react";
import { updateSection } from "../db/sections";
import { useRouter } from "next/navigation";
import { type CourseSection } from "@prisma/client";

type Props = {
  section: CourseSection;
};

export default function EditSectionForm({ section }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof sectionSchema>>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      name: section.name,
      order: section.order,
      status: section.status,
      courseId: section.courseId,
    },
  });

  const onSubmit = async (values: z.infer<typeof sectionSchema>) => {
    setLoading(true);
    try {
      const result = await updateSection(section.id, values);
      if (result.error) {
        toast.error(result.message);
      } else {
        toast.success("Section updated successfully!");
        router.push(`/admin/courses/${section.courseId}`);
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
          label="Section Name"
          icon={<LeafIcon />}
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
              <span>Updating...</span>
            </div>
          ) : (
            "Update Section"
          )}
        </Button>
      </form>
    </Form>
  );
}