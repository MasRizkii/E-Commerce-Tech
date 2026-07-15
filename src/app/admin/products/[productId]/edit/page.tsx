import { notFound } from "next/navigation";

import {
  ProductForm,
  type EditableProduct,
} from "@/features/products/components/product-form";
import { createClient } from "@/lib/supabase/server";

type EditProductPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { productId } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
        id,
        name,
        description,
        category,
        condition,
        price,
        stock,
        image,
        rating,
        sold,
        is_featured,
        is_promo
      `,
    )
    .eq("id", productId)
    .maybeSingle();

  if (error || !product) {
    notFound();
  }

  return (
    <ProductForm
      product={
        {
          ...product,
          price: Number(product.price),
          stock: Number(product.stock),
          rating: Number(product.rating),
          sold: Number(product.sold),
        } as EditableProduct
      }
    />
  );
}