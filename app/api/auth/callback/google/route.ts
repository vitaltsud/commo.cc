import { NextRequest, NextResponse } from "next/server";

// Placeholder: exchange code for tokens and create session when backend is ready.
// For now redirect back home; add NextAuth or custom session logic later.
export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/signin?error=no_code", baseUrl));
  }

  // TODO: exchange code for tokens, create user/session, redirect to dashboard
  return NextResponse.redirect(new URL("/", baseUrl));
}
