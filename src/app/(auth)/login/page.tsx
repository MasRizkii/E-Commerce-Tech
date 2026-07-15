import type { Metadata } from "next";

import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Login",
};

type LoginPageProps = {
  searchParams: Promise<{
    redirect?: string | string[];
    error?: string | string[];
  }>;
};

function getSingleValue(
  value: string | string[] | undefined,
) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;

  return (
    <>
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">
        Welcome Back
      </p>

      <h1 className="mt-3 font-heading text-4xl font-extrabold text-ink">
        Sign in to your account
      </h1>

      <p className="mt-3 text-sm leading-6 text-muted">
        Masukkan email dan password untuk melanjutkan.
      </p>

      <div className="mt-8">
        <LoginForm
          redirectTo={getSingleValue(params.redirect)}
          externalError={getSingleValue(params.error)}
        />
      </div>
    </>
  );
}