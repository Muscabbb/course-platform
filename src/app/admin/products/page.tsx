import PageHeader from "@/components/pageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import ProductTable from "@/features/products/component/productTable";
export default async function CoursesPage() {
  return (
    <div className="container my-6">
      <PageHeader title="Products">
        <Button className="capitalize" asChild>
          <Link href={"/admin/products/newProduct"}>New Product</Link>
        </Button>
      </PageHeader>
      <ProductTable />
    </div>
  );
}
