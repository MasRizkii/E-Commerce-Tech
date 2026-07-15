"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  productSchema,
  type ProductSchema,
} from "@/features/products/schema";
import { createClient } from "@/lib/supabase/server";

export type ProductActionState = {
  status: "idle" | "error";
  message: string;
  errors?: Record<string, string[] | undefined>;
};

function createSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    condition: formData.get("condition"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    image: formData.get("image"),
    rating: formData.get("rating"),
    sold: formData.get("sold"),
    isFeatured: formData.get("isFeatured") === "on",
    isPromo: formData.get("isPromo") === "on",
  });
}

async function getAdminContext() {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    return {
      supabase,
      isAdmin: false,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  return {
    supabase,
    isAdmin: profile?.role === "admin",
  };
}

function getDatabaseProduct(parsedProduct: ProductSchema) {
  return {
    name: parsedProduct.name,
    slug: createSlug(parsedProduct.name),
    description: parsedProduct.description,
    category: parsedProduct.category,
    condition: parsedProduct.condition,
    price: parsedProduct.price,
    stock: parsedProduct.stock,
    image: parsedProduct.image,
    rating: parsedProduct.rating,
    sold: parsedProduct.sold,
    is_featured: parsedProduct.isFeatured,
    is_promo: parsedProduct.isPromo,
  };
}

function revalidateProductPages() {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
}

export async function createProductAction(
  _previousState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const { supabase, isAdmin } = await getAdminContext();

  if (!isAdmin) {
    return {
      status: "error",
      message: "Kamu tidak memiliki akses admin.",
    };
  }

  const parsed = parseProductForm(formData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data produk.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const product = getDatabaseProduct(parsed.data);

  const { error } = await supabase
    .from("products")
    .insert(product);

  if (error) {
    console.error("Create product error:", error);

    return {
      status: "error",
      message:
        error.code === "23505"
          ? "Nama atau slug produk sudah digunakan."
          : "Produk gagal ditambahkan.",
    };
  }

  revalidateProductPages();
  redirect("/admin/products?success=created");
}

export async function updateProductAction(
  productId: string,
  _previousState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const { supabase, isAdmin } = await getAdminContext();

  if (!isAdmin) {
    return {
      status: "error",
      message: "Kamu tidak memiliki akses admin.",
    };
  }

  const parsed = parseProductForm(formData);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali data produk.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const product = getDatabaseProduct(parsed.data);

  const { error } = await supabase
    .from("products")
    .update(product)
    .eq("id", productId);

  if (error) {
    console.error("Update product error:", error);

    return {
      status: "error",
      message:
        error.code === "23505"
          ? "Nama atau slug produk sudah digunakan."
          : "Produk gagal diperbarui.",
    };
  }

  revalidateProductPages();
  redirect("/admin/products?success=updated");
}

export async function deleteProductAction(
  formData: FormData,
): Promise<void> {
  const { supabase, isAdmin } = await getAdminContext();

  if (!isAdmin) {
    redirect("/login");
  }

  const productId = formData.get("productId");

  if (typeof productId !== "string" || !productId) {
    redirect("/admin/products?error=invalid-product");
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    console.error("Delete product error:", error);

    redirect("/admin/products?error=delete-failed");
  }

  revalidateProductPages();
}