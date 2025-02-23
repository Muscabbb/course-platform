import PageHeader from "@/components/pageHeader";
import ProductForm from "@/features/products/component/productForm";

export default function NewCoursePage() {
  return (
    <div className="container my-6">
      <PageHeader title="New Product" />
      <ProductForm />
    </div>
  );
}
