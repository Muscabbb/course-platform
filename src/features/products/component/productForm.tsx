"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomForm from "@/components/cusntomForm";
import { FormFieldType } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  DessertIcon,
  LeafIcon,
  Loader,
  Upload,
  DollarSignIcon,
} from "lucide-react";
import { createProduct } from "../db/product";
import { productSchema } from "@/features/schemas/productSchema";
// Remove the getCoursesName import as we'll use the API route instead

export default function ProductForm() {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([{ name: "" }]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      price: 0,
      status: "private" as "private" | "public",
      courseId: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    // setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(data);
    // console.log("Submitted");

    // try {
    //   await createProduct(data);
    // } catch (error) {
    //   console.log(error);
    // }
    // form.reset();
    // setLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-6 bg-slate-500 grid-cols-1 md:grid-cols-2 items-start"
      >
        <CustomForm
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="name"
          label="Product Name"
          icon={<LeafIcon />}
        />
        <CustomForm
          control={form.control}
          fieldType={FormFieldType.NUMBER}
          name="price"
          label="Product Price"
          icon={<DollarSignIcon />}
        />
        <CustomForm
          control={form.control}
          fieldType={FormFieldType.SELECT}
          name="courseId"
          label="Select Course"
          courseNames={courses}
        />
        <CustomForm
          control={form.control}
          fieldType={FormFieldType.FILE}
          name="imageUrl"
          label="Product Image"
          icon={<Upload />}
        />
        <CustomForm
          control={form.control}
          fieldType={FormFieldType.RADIO}
          name="status"
          label="Product Status"
          options={[
            { label: "Private", value: "private" },
            { label: "Public", value: "public" },
          ]}
        />
        <CustomForm
          control={form.control}
          fieldType={FormFieldType.TEXTAREA}
          name="description"
          label="Product Description"
          icon={<DessertIcon />}
        />
        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="disabled:bg-gray-600 my-3"
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
