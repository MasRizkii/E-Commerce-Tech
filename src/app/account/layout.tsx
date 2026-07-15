import { redirect } from "next/navigation";

import { AccountSidebar } from "@/components/layout/account-sidebar";
import { BackButton } from "@/components/layout/back-button";
import { Header } from "@/components/layout/header";
import { Container } from "@/components/ui/container";
import { createClient } from "@/lib/supabase/server";

type AccountLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function AccountLayout({
  children,
}: AccountLayoutProps) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/login?redirect=/account/profile");
  }

  const userId = data.claims.sub;

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email")
    .eq("id", userId)
    .single();

  const fallbackEmail =
    typeof data.claims.email === "string" ? data.claims.email : "";

  const fallbackName =
    typeof data.claims.user_metadata === "object" &&
    data.claims.user_metadata !== null &&
    "name" in data.claims.user_metadata &&
    typeof data.claims.user_metadata.name === "string"
      ? data.claims.user_metadata.name
      : "";

  const sidebarName = profile?.name ?? fallbackName;
  const sidebarEmail = profile?.email ?? fallbackEmail;

  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <Container className="pt-6">
        <BackButton />
      </Container>

      <Container className="grid gap-6 py-6 lg:grid-cols-[280px_1fr] lg:items-start">
        <AccountSidebar name={sidebarName} email={sidebarEmail} />

        <main>{children}</main>
      </Container>
    </div>
  );
}
