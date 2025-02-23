"use server";

import { productSchema } from "@/features/schemas/productSchema";
import { prisma } from "@/lib/prisma";
import { canCreate } from "@/permissions/course";
import { getCurrentUser } from "@/services/clerk";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function createProduct(unSafeData: z.infer<typeof productSchema>) {
  const { success, data } = productSchema.safeParse(unSafeData);

  if (!success || !canCreate(await getCurrentUser()))
    return { error: true, message: "there was an error creating the Product!" };

  const product = await prisma.product.create({ data });

  if (product) {
    redirect("/admin/products");
  }

  return product;
}

export async function updateProduct(
  id: string,
  data: z.infer<typeof productSchema>
) {
  const product = await prisma.product.update({ where: { id }, data });
  if (product) {
    redirect("/admin/products");
  }

  return product;
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.delete({ where: { id } });
  if (product) {
    redirect("/admin/products");
  }

  return product;
}
