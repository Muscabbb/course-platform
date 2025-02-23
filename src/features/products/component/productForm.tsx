"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomForm from "@/components/cusntomForm";
import { FormFieldType } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  DessertIcon,
  DollarSign,
  LeafIcon,
  Loader,
  Upload,
} from "lucide-react";
import { createProduct } from "../db/product";
import { productSchema } from "@/features/schemas/productSchema";

export default function ProductForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      price: 0,
      status: "private" as "private" | "public",
    },
  });

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Submitted");

    try {
      await createProduct(data);
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
          label="Product Name"
          icon={<LeafIcon />}
        />
        <CustomForm
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="description"
          label="Product Description"
          icon={<DessertIcon />}
        />
        <CustomForm
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="price"
          label="Product Price"
          icon={<DollarSign />}
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
