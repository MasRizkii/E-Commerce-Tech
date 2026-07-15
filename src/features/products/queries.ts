import "server-only";

import { cache } from "react";

import { allProducts } from "@/features/products/data";
import type {
  Product,
  ProductCategory,
  ProductCondition,
} from "@/features/products/types";
import { createClient } from "@/lib/supabase/server";

export type ProductSort =
  | "recommended"
  | "newest"
  | "price-asc"
  | "price-desc";

export type ProductCollection =
  | "best-seller"
  | "new-arrival"
  | "top-rated"
  | "promo";

export type ShopFilters = {
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  collection?: string;
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  condition: string;
  price: number;
  stock: number;
  image: string;
  rating: number;
  sold: number;
  is_featured: boolean;
  is_promo: boolean;
  created_at: string;
};

const databaseCategoryToProductCategory: Record<
  string,
  ProductCategory
> = {
  laptop: "Laptop",
  smartphone: "Smartphone",
  desktop: "Desktop",
  tablet: "Tablet",
  accessories: "Accessories",
};

const productCategoryToDatabaseCategory: Record<
  ProductCategory,
  string
> = {
  Laptop: "laptop",
  Smartphone: "smartphone",
  Desktop: "desktop",
  Tablet: "tablet",
  Accessories: "accessories",
};

function mapProductRow(row: ProductRow): Product {
  const category =
    databaseCategoryToProductCategory[row.category] ??
    "Accessories";

  const condition: ProductCondition =
    row.condition === "second" ? "Second" : "Brand New";

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    category,
    condition,
    price: Number(row.price),
    stock: Number(row.stock),
    image: row.image,
    rating: Number(row.rating),
    sold: Number(row.sold),
    isFeatured: row.is_featured,
    isPromo: row.is_promo,
    createdAt: row.created_at,
  };
}

function parsePrice(value?: string) {
  if (!value) {
    return undefined;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : undefined;
}

const getDatabaseProducts = cache(
  async (): Promise<Product[]> => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select(
        `
          id,
          name,
          slug,
          description,
          category,
          condition,
          price,
          stock,
          image,
          rating,
          sold,
          is_featured,
          is_promo,
          created_at
        `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get products error:", error);

      return allProducts;
    }

    return (data as ProductRow[]).map(mapProductRow);
  },
);

export async function getAllProducts() {
  return getDatabaseProducts();
}

export async function getFilteredProducts(
  filters: ShopFilters,
): Promise<Product[]> {
  const keyword = filters.q?.trim().toLowerCase();
  const minimumPrice = parsePrice(filters.minPrice);
  const maximumPrice = parsePrice(filters.maxPrice);

  let products = [...(await getDatabaseProducts())];

  if (keyword) {
    products = products.filter((product) => {
      const searchableText = `
        ${product.name}
        ${product.description ?? ""}
        ${product.category}
        ${product.condition}
      `.toLowerCase();

      return searchableText.includes(keyword);
    });
  }

  if (filters.category) {
    products = products.filter(
      (product) =>
        product.category.toLowerCase() ===
        filters.category?.toLowerCase(),
    );
  }

  if (minimumPrice !== undefined) {
    products = products.filter(
      (product) => product.price >= minimumPrice,
    );
  }

  if (maximumPrice !== undefined) {
    products = products.filter(
      (product) => product.price <= maximumPrice,
    );
  }

  switch (filters.collection as ProductCollection) {
    case "best-seller":
      products.sort(
        (firstProduct, secondProduct) =>
          secondProduct.sold - firstProduct.sold,
      );
      break;

    case "new-arrival":
      products.sort(
        (firstProduct, secondProduct) =>
          new Date(secondProduct.createdAt).getTime() -
          new Date(firstProduct.createdAt).getTime(),
      );
      break;

    case "top-rated":
      products.sort(
        (firstProduct, secondProduct) =>
          secondProduct.rating - firstProduct.rating,
      );
      break;

    case "promo":
      products = products.filter(
        (product) => product.isPromo,
      );
      break;
  }

  switch (filters.sort as ProductSort) {
    case "newest":
      products.sort(
        (firstProduct, secondProduct) =>
          new Date(secondProduct.createdAt).getTime() -
          new Date(firstProduct.createdAt).getTime(),
      );
      break;

    case "price-asc":
      products.sort(
        (firstProduct, secondProduct) =>
          firstProduct.price - secondProduct.price,
      );
      break;

    case "price-desc":
      products.sort(
        (firstProduct, secondProduct) =>
          secondProduct.price - firstProduct.price,
      );
      break;

    case "recommended":
    default:
      if (!filters.collection) {
        products.sort((firstProduct, secondProduct) => {
          if (
            firstProduct.isFeatured !==
            secondProduct.isFeatured
          ) {
            return firstProduct.isFeatured ? -1 : 1;
          }

          return secondProduct.rating - firstProduct.rating;
        });
      }
  }

  return products;
}

export const getProductBySlug = cache(
  async (slug: string): Promise<Product | undefined> => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select(
        `
          id,
          name,
          slug,
          description,
          category,
          condition,
          price,
          stock,
          image,
          rating,
          sold,
          is_featured,
          is_promo,
          created_at
        `,
      )
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("Get product by slug error:", error);

      return allProducts.find(
        (product) => product.slug === slug,
      );
    }

    if (!data) {
      return undefined;
    }

    return mapProductRow(data as ProductRow);
  },
);

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const supabase = await createClient();

  const databaseCategory =
    productCategoryToDatabaseCategory[product.category];

  const { data, error } = await supabase
    .from("products")
    .select(
      `
        id,
        name,
        slug,
        description,
        category,
        condition,
        price,
        stock,
        image,
        rating,
        sold,
        is_featured,
        is_promo,
        created_at
      `,
    )
    .eq("category", databaseCategory)
    .neq("id", product.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Get related products error:", error);

    return allProducts
      .filter(
        (relatedProduct) =>
          relatedProduct.category === product.category &&
          relatedProduct.id !== product.id,
      )
      .slice(0, limit);
  }

  return (data as ProductRow[]).map(mapProductRow);
}

export async function getFeaturedProducts(
  limit = 4,
): Promise<Product[]> {
  const products = await getDatabaseProducts();

  return products
    .filter((product) => product.isFeatured)
    .slice(0, limit);
}

export async function getNewArrivalProducts(
  limit = 4,
): Promise<Product[]> {
  const products = await getDatabaseProducts();

  return [...products]
    .sort(
      (firstProduct, secondProduct) =>
        new Date(secondProduct.createdAt).getTime() -
        new Date(firstProduct.createdAt).getTime(),
    )
    .slice(0, limit);
}