import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Mail, UserRound } from "lucide-react";

import { Container } from "@/components/ui/container";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My Profile",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: authData } =
    await supabase.auth.getClaims();

  const userId = authData?.claims?.sub;

  if (!userId) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email, role")
    .eq("id", userId)
    .single();

  return (
    <main className="py-10 sm:py-14">
      <Container>
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-600">
          Account
        </p>

        <h1 className="mt-3 font-heading text-4xl font-extrabold text-ink">
          My Profile
        </h1>

        <div className="mt-8 max-w-2xl rounded-2xl bg-white p-6 shadow-card sm:p-8">
          <div className="grid size-20 place-items-center rounded-full bg-brand-50 text-brand-500">
            <UserRound className="size-9" />
          </div>

          <dl className="mt-8 space-y-5">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-muted">
                Name
              </dt>

              <dd className="mt-1 font-heading text-lg font-bold text-ink">
                {profile?.name ?? "User"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-muted">
                Email
              </dt>

              <dd className="mt-1 flex items-center gap-2 text-sm text-ink">
                <Mail className="size-4 text-brand-500" />
                {profile?.email ??
                  String(authData.claims.email ?? "")}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-muted">
                Role
              </dt>

              <dd className="mt-1 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-bold capitalize text-brand-600">
                {profile?.role ?? "customer"}
              </dd>
            </div>
          </dl>
        </div>
      </Container>
    </main>
  );
}