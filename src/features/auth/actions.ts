"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  loginSchema,
  registerSchema,
} from "@/features/auth/schema";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  success?: boolean;
  message?: string;

  fieldErrors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
};

const initialErrorMessage =
  "Terjadi kesalahan. Silakan coba lagi.";

function getSafeRedirectPath(value: FormDataEntryValue | null) {
  if (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//")
  ) {
    return value;
  }

  return "/account/profile";
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return {
      fieldErrors:
        result.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } =
    await supabase.auth.signInWithPassword({
      email: result.data.email,
      password: result.data.password,
    });

  if (error) {
    return {
      message:
        "Email atau password yang lu masukkan salah.",
    };
  }

  const redirectPath = getSafeRedirectPath(
    formData.get("redirectTo"),
  );

  revalidatePath("/", "layout");
  redirect(redirectPath);
}

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const result = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword:
      formData.get("confirmPassword"),
  });

  if (!result.success) {
    return {
      fieldErrors:
        result.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,

    options: {
      data: {
        name: result.data.name,
      },

      emailRedirectTo: `${siteUrl}/auth/confirm`,
    },
  });

  if (error) {
    return {
      message: error.message || initialErrorMessage,
    };
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/account/profile");
  }

  return {
    success: true,
    message:
      "Registrasi berhasil. Periksa email untuk mengaktifkan akun.",
  };
}

export async function logoutAction() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}