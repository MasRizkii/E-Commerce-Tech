import { allProducts } from "@/features/products/data";
import type { Product } from "@/features/products/types";

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

function parsePrice(value?: string) {
  if (!value) {
    return undefined;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : undefined;
}

export function getFilteredProducts(filters: ShopFilters): Product[] {
  const keyword = filters.q?.trim().toLowerCase();
  const minimumPrice = parsePrice(filters.minPrice);
  const maximumPrice = parsePrice(filters.maxPrice);

  let products = [...allProducts];

  if (keyword) {
    products = products.filter((product) => {
      const searchableText =
        `${product.name} ${product.category} ${product.condition}`.toLowerCase();

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
      products = products.filter((product) => product.isPromo);
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
          if (firstProduct.isFeatured !== secondProduct.isFeatured) {
            return firstProduct.isFeatured ? -1 : 1;
          }

          return secondProduct.rating - firstProduct.rating;
        });
      }
  }

  return products;
}

export function getProductBySlug(slug: string) {
  return allProducts.find(
    (product) => product.slug === slug,
  );
}

export function getRelatedProducts(
  product: Product,
  limit = 4,
) {
  return allProducts
    .filter(
      (relatedProduct) =>
        relatedProduct.category === product.category &&
        relatedProduct.id !== product.id,
    )
    .slice(0, limit);
}