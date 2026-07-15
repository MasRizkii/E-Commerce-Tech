import type { Metadata } from "next";

import { CartView } from "@/features/cart/components/cart-view";

export const metadata: Metadata = {
  title: "Cart",
  description:
    "Periksa dan atur produk yang berada di keranjang belanja.",
};

export default function CartPage() {
  return <CartView />;
}