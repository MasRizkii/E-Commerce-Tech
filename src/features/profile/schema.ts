import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter.")
    .max(80, "Nama maksimal 80 karakter."),

  phone: z
    .string()
    .trim()
    .max(25, "Nomor telepon maksimal 25 karakter.")
    .refine(
      (value) => !value || /^[0-9+\-\s()]+$/.test(value),
      "Format nomor telepon tidak valid.",
    ),

  address: z
    .string()
    .trim()
    .max(300, "Alamat maksimal 300 karakter."),
});

export type ProfileSchema = z.infer<typeof profileSchema>;