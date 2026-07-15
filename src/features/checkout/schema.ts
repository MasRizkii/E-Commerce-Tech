import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Nama penerima minimal 2 karakter.")
    .max(80, "Nama penerima maksimal 80 karakter."),

  customerEmail: z
    .string()
    .trim()
    .email("Format email tidak valid."),

  phone: z
    .string()
    .trim()
    .min(8, "Nomor telepon minimal 8 karakter.")
    .max(25, "Nomor telepon maksimal 25 karakter.")
    .regex(
      /^[0-9+\-\s()]+$/,
      "Format nomor telepon tidak valid.",
    ),

  shippingAddress: z
    .string()
    .trim()
    .min(10, "Alamat pengiriman minimal 10 karakter.")
    .max(500, "Alamat maksimal 500 karakter."),

  notes: z
    .string()
    .trim()
    .max(300, "Catatan maksimal 300 karakter."),
});

export const checkoutItemsSchema = z
  .array(
    z.object({
      productId: z
        .string()
        .uuid(
          "Produk pada cart lama tidak valid. Kosongkan cart dan tambahkan ulang produk.",
        ),

      quantity: z
        .number()
        .int()
        .min(1)
        .max(99),
    }),
  )
  .min(1, "Keranjang masih kosong.");

export type CheckoutSchema = z.infer<
  typeof checkoutSchema
>;