import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nama produk minimal 3 karakter.")
    .max(120, "Nama produk maksimal 120 karakter."),

  description: z
    .string()
    .trim()
    .min(10, "Deskripsi minimal 10 karakter.")
    .max(1000, "Deskripsi maksimal 1000 karakter."),

  category: z.enum([
    "smartphone",
    "laptop",
    "desktop",
    "tablet",
    "accessories",
  ]),

  condition: z.enum(["brand-new", "second"]),

  price: z.coerce
    .number()
    .int("Harga harus berupa bilangan bulat.")
    .positive("Harga harus lebih besar dari 0."),

  stock: z.coerce
    .number()
    .int("Stock harus berupa bilangan bulat.")
    .min(0, "Stock tidak boleh kurang dari 0."),

  image: z
    .string()
    .trim()
    .min(1, "Path atau URL gambar wajib diisi."),

  rating: z.coerce
    .number()
    .min(0, "Rating minimal 0.")
    .max(5, "Rating maksimal 5."),

  sold: z.coerce
    .number()
    .int("Jumlah terjual harus berupa bilangan bulat.")
    .min(0, "Jumlah terjual tidak boleh negatif."),

  isFeatured: z.boolean(),
  isPromo: z.boolean(),
});

export type ProductSchema = z.infer<typeof productSchema>;