export type ProductCondition = "Brand New" | "Second";

export type ProductCategory =
  | "Laptop"
  | "Smartphone"
  | "Desktop"
  | "Accessories";

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  image: string;
  condition: ProductCondition;
  stock: number;
  rating: number;
  sold: number;
  isFeatured: boolean;
  isPromo: boolean;
  createdAt: string;
};