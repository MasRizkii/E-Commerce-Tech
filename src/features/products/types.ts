export type ProductCondition = "Brand New" | "Second";

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  image: string;
  condition: ProductCondition;
};