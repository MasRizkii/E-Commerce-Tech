import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, {
      error: "Email wajib diisi.",
    })
    .email({
      error: "Format email tidak valid.",
    }),

  password: z
    .string()
    .min(1, {
      error: "Password wajib diisi.",
    }),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, {
        error: "Nama minimal 2 karakter.",
      })
      .max(60, {
        error: "Nama maksimal 60 karakter.",
      }),

    email: z
      .string()
      .trim()
      .min(1, {
        error: "Email wajib diisi.",
      })
      .email({
        error: "Format email tidak valid.",
      }),

    password: z
      .string()
      .min(8, {
        error: "Password minimal 8 karakter.",
      })
      .regex(/[A-Za-z]/, {
        error: "Password harus memiliki huruf.",
      })
      .regex(/[0-9]/, {
        error: "Password harus memiliki angka.",
      }),

    confirmPassword: z.string(),
  })
  .refine(
    (values) =>
      values.password === values.confirmPassword,
    {
      path: ["confirmPassword"],
      error: "Konfirmasi password tidak sama.",
    },
  );