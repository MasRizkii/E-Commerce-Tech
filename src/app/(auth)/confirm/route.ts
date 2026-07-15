import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

function getSafePath(value: string | null) {
  if (
    value &&
    value.startsWith("/") &&
    !value.startsWith("//")
  ) {
    return value;
  }

  return "/account/profile";
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const tokenHash =
    requestUrl.searchParams.get("token_hash");

  const type = requestUrl.searchParams.get(
    "type",
  ) as EmailOtpType | null;

  const nextPath = getSafePath(
    requestUrl.searchParams.get("next"),
  );

  if (tokenHash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      return NextResponse.redirect(
        new URL(nextPath, request.url),
      );
    }
  }

  const loginUrl = new URL("/login", request.url);

  loginUrl.searchParams.set(
    "error",
    "Link konfirmasi tidak valid atau sudah kedaluwarsa.",
  );

  return NextResponse.redirect(loginUrl);
}