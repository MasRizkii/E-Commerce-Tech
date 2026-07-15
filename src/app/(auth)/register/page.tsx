import type { Metadata } from "next";

import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <>
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">
        Create an Account
      </p>

      <h1 className="mt-3 font-heading text-4xl font-extrabold text-ink">
        Start shopping with toko.mac
      </h1>

      <p className="mt-3 text-sm leading-6 text-muted">
        Buat akun untuk menyimpan profil dan riwayat
        pesanan.
      </p>

      <div className="mt-8">
        <RegisterForm />
      </div>
    </>
  );
}