import { redirect } from "next/navigation";

import { ProfileForm } from "@/features/profile/components/profile-form";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  const claims = claimsData?.claims;
  const userId = claims?.sub;

  if (claimsError || !claims || !userId) {
    redirect("/login?redirect=/account/profile");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("name, email, phone, address, role")
    .eq("id", userId)
    .single();

  if (profileError) {
    console.error("Get profile error:", profileError);
  }

  const { count: ordersCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  const fallbackEmail =
    typeof claims.email === "string" ? claims.email : "";

  const fallbackName =
    typeof claims.user_metadata === "object" &&
    claims.user_metadata !== null &&
    "name" in claims.user_metadata &&
    typeof claims.user_metadata.name === "string"
      ? claims.user_metadata.name
      : "";

  return (
    <ProfileForm
      profile={{
        name: profile?.name ?? fallbackName,
        email: profile?.email ?? fallbackEmail,
        phone: profile?.phone ?? "",
        address: profile?.address ?? "",
        role: profile?.role ?? "customer",
      }}
      stats={{
        totalOrders: ordersCount ?? 0,
        reviewsAdded: 0,
      }}
    />
  );
}
