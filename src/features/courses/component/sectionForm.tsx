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
import { createSection } from "../db/sections";
import { useRouter } from "next/navigation";

type Props = {
  courseId: string;
};

export default function SectionForm({ courseId }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof sectionSchema>>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      name: "",
      order: 0,
      status: "private",
      courseId,
    },
  });

  const onSubmit = async (values: z.infer<typeof sectionSchema>) => {
    setLoading(true);
    try {
      const result = await createSection(values);
      if (result.error) {
        toast.error(result.message);
      } else {
        toast.success("Section created successfully!");
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
              <span>Submitting...</span>
            </div>
          ) : (
            "Create Section"
          )}
        </Button>
      </form>
    </Form>
  );
}