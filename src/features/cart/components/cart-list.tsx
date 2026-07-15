import { CartItem } from "@/features/cart/components/cart-item";
import type { CartItem as CartItemType } from "@/features/cart/types";

type CartListProps = {
  items: CartItemType[];
};

export function CartList({ items }: CartListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
}