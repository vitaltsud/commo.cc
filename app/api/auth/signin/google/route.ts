import { NextRequest, NextResponse } from "next/server";

const GOOGLE_AUTH = "https://accounts.google.com/o/oauth2/v2/auth";

export function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!clientId) {
    return NextResponse.redirect(new URL("/pl/pl/signin", baseUrl));
  }

  const redirectUri = `${baseUrl}/api/auth/callback/google`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  const url = `${GOOGLE_AUTH}?${params.toString()}`;
  return NextResponse.redirect(url);
}
