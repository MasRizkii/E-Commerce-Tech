"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import {
  LockKeyhole,
  Mail,
  UserPlus,
  UserRound,
} from "lucide-react";

import {
  registerAction,
  type AuthActionState,
} from "@/features/auth/actions";

const initialState: AuthActionState = {};

function RegisterButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 font-heading text-sm font-bold text-white transition hover:bg-brand-600 disabled:bg-brand-300"
    >
      <UserPlus aria-hidden="true" className="size-5" />

      {pending ? "Creating account..." : "Create Account"}
    </button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(
    registerAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.message && (
        <div
          role="status"
          className={
            state.success
              ? "rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              : "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          }
        >
          {state.message}
        </div>
      )}

      <div>
        <label
          htmlFor="register-name"
          className="text-sm font-bold text-ink"
        >
          Full Name
        </label>

        <div className="relative mt-2">
          <UserRound
            aria-hidden="true"
            className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted"
          />

          <input
            id="register-name"
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Your full name"
            className="h-12 w-full rounded-lg border border-border bg-white pl-12 pr-4 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </div>

        {state.fieldErrors?.name?.[0] && (
          <p className="mt-1.5 text-xs text-red-600">
            {state.fieldErrors.name[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="register-email"
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
            id="register-email"
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
          htmlFor="register-password"
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
            id="register-password"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="Minimum 8 characters"
            className="h-12 w-full rounded-lg border border-border bg-white pl-12 pr-4 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </div>

        {state.fieldErrors?.password?.[0] && (
          <p className="mt-1.5 text-xs text-red-600">
            {state.fieldErrors.password[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="register-confirm-password"
          className="text-sm font-bold text-ink"
        >
          Confirm Password
        </label>

        <div className="relative mt-2">
          <LockKeyhole
            aria-hidden="true"
            className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted"
          />

          <input
            id="register-confirm-password"
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Repeat your password"
            className="h-12 w-full rounded-lg border border-border bg-white pl-12 pr-4 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </div>

        {state.fieldErrors?.confirmPassword?.[0] && (
          <p className="mt-1.5 text-xs text-red-600">
            {state.fieldErrors.confirmPassword[0]}
          </p>
        )}
      </div>

      <RegisterButton />

      <p className="text-center text-sm text-muted">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="font-bold text-brand-600 hover:text-brand-700"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}