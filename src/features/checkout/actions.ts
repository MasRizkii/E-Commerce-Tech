"use server";

import { revalidatePath } from "next/cache";

import {
  checkoutItemsSchema,
  checkoutSchema,
} from "@/features/checkout/schema";
import { createClient } from "@/lib/supabase/server";

export type CheckoutActionState = {
  status: "idle" | "error" | "success";
  message: string;
  orderId?: string;
  orderNumber?: string;
  errors?: Record<string, string[] | undefined>;
};

export async function createOrderAction(
  _previousState: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    return {
      status: "error",
      message:
        "Sesi login tidak ditemukan. Silakan login kembali.",
    };
  }

  const parsedCheckout = checkoutSchema.safeParse({
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    phone: formData.get("phone"),
    shippingAddress: formData.get("shippingAddress"),
    notes: formData.get("notes") ?? "",
  });

  if (!parsedCheckout.success) {
    return {
      status: "error",
      message: "Periksa kembali data checkout.",
      errors:
        parsedCheckout.error.flatten().fieldErrors,
    };
  }

  let rawItems: unknown;

  try {
    rawItems = JSON.parse(
      String(formData.get("items") ?? "[]"),
    );
  } catch {
    return {
      status: "error",
      message: "Data keranjang tidak valid.",
    };
  }

  const parsedItems =
    checkoutItemsSchema.safeParse(rawItems);

  if (!parsedItems.success) {
    return {
      status: "error",
      message:
        parsedItems.error.issues[0]?.message ??
        "Data keranjang tidak valid.",
    };
  }

  const { data, error } = await supabase.rpc(
    "create_mock_order",
    {
      p_customer_name:
        parsedCheckout.data.customerName,
      p_customer_email:
        parsedCheckout.data.customerEmail,
      p_phone: parsedCheckout.data.phone,
      p_shipping_address:
        parsedCheckout.data.shippingAddress,
      p_items: parsedItems.data,
      p_notes: parsedCheckout.data.notes || null,
    },
  );

  if (error) {
    console.error("Create order error:", error);

    return {
      status: "error",
      message:
        error.message ||
        "Pesanan gagal dibuat. Silakan coba kembali.",
    };
  }

  const createdOrder = Array.isArray(data)
    ? data[0]
    : data;

  const order = createdOrder as
    | {
        order_id?: string;
        order_number?: string;
      }
    | undefined;

  if (!order?.order_id) {
    return {
      status: "error",
      message: "ID pesanan tidak ditemukan.",
    };
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/account/orders");
  revalidatePath("/admin/products");

  return {
    status: "success",
    message: "Pesanan berhasil dibuat.",
    orderId: order.order_id,
    orderNumber: order.order_number,
  };
}