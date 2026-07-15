"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircle, Trash2 } from "lucide-react";

import { deleteProductAction } from "@/features/products/actions";

type DeleteProductButtonProps = {
  productId: string;
  productName: string;
};

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 transition hover:text-red-700 disabled:opacity-50"
    >
      {pending ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <Trash2 className="size-4" />
      )}

      Hapus
    </button>
  );
}

export function DeleteProductButton({
  productId,
  productName,
}: DeleteProductButtonProps) {
  return (
    <form
      action={deleteProductAction}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Hapus produk "${productName}"?`,
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input
        type="hidden"
        name="productId"
        value={productId}
      />

      <DeleteButton />
    </form>
  );
}