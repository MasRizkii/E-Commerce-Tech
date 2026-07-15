import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Container } from "@/components/ui/container";
import { CheckoutForm } from "@/features/checkout/components/checkout-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  const claims = claimsData?.claims;
  const userId = claims?.sub;

  if (claimsError || !userId) {
    redirect("/login?redirect=/checkout");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email, phone, address")
    .eq("id", userId)
    .maybeSingle();

  const claimsEmail =
    typeof claims.email === "string"
      ? claims.email
      : "";

  return (
    <div className="min-h-screen bg-surface py-10 sm:py-14">
      <Container>
        <header className="mb-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">
            Mock Transaction
          </p>

          <h1 className="mt-3 font-heading text-4xl font-extrabold text-ink">
            Checkout
          </h1>
        </header>

        <CheckoutForm
          profile={{
            name: profile?.name ?? "",
            email: profile?.email ?? claimsEmail,
            phone: profile?.phone ?? "",
            address: profile?.address ?? "",
          }}
        />
      </Container>
    </div>
  );
}