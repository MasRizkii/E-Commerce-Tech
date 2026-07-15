"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import {
  LockKeyhole,
  LogIn,
  Mail,
} from "lucide-react";

import {
  loginAction,
  type AuthActionState,
} from "@/features/auth/actions";

type LoginFormProps = {
  redirectTo?: string;
  externalError?: string;
};

const initialState: AuthActionState = {};

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 font-heading text-sm font-bold text-white transition hover:bg-brand-600 disabled:bg-brand-300"
    >
      <LogIn aria-hidden="true" className="size-5" />

      {pending ? "Signing in..." : "Sign In"}
    </button>
  );
}

export function LoginForm({
  redirectTo,
  externalError,
}: LoginFormProps) {
  const [state, formAction] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input
        type="hidden"
        name="redirectTo"
        value={redirectTo ?? ""}
      />

      {(state.message || externalError) && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.message ?? externalError}
        </div>
      )}

      <div>
        <label
          htmlFor="login-email"
          className="text-sm font-bold text-ink"
        >
          Email
        </label>

        <div className="relative mt-2">
          <Mail
            aria-hidden="true"
            className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted"
          />

          <input
            id="login-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="name@example.com"
            className="h-12 w-full rounded-lg border border-border bg-white pl-12 pr-4 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </div>

        {state.fieldErrors?.email?.[0] && (
          <p className="mt-1.5 text-xs text-red-600">
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="text-sm font-bold text-ink"
        >
          Password
        </label>

        <div className="relative mt-2">
          <LockKeyhole
            aria-hidden="true"
            className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted"
          />

          <input
            id="login-password"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            className="h-12 w-full rounded-lg border border-border bg-white pl-12 pr-4 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </div>

        {state.fieldErrors?.password?.[0] && (
          <p className="mt-1.5 text-xs text-red-600">
            {state.fieldErrors.password[0]}
          </p>
        )}
      </div>

      <LoginButton />

      <p className="text-center text-sm text-muted">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="font-bold text-brand-600 hover:text-brand-700"
        >
          Register
        </Link>
      </p>
    </form>
  );
}