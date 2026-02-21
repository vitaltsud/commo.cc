import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { encodeSession, sessionCookieOptions } from "@/lib/session";

/** Allow only relative paths to prevent open redirect. */
function isValidCallbackUrl(url: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  return url.startsWith("/") && !url.includes(":");
}

// Exchange code for tokens, create/update user, set session cookie, redirect back.
export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  let callbackUrl: string | null = null;
  if (state) {
    try {
      callbackUrl = decodeURIComponent(state);
      if (callbackUrl.includes("%")) callbackUrl = decodeURIComponent(callbackUrl);
    } catch {
      callbackUrl = null;
    }
  }
  const redirectPath = isValidCallbackUrl(callbackUrl) ? callbackUrl : "/pl/pl";
  const redirectUrl = new URL(redirectPath, baseUrl);
  const signinErrorUrl = new URL("/pl/pl/signin?error=callback", baseUrl);

  if (!code) {
    return NextResponse.redirect(new URL("/pl/pl/signin?error=no_code", baseUrl));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(redirectUrl);
  }

  try {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${baseUrl}/api/auth/callback/google`,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL("/pl/pl/signin?error=token", baseUrl));
  }

  const tokenData = (await tokenRes.json()) as { access_token?: string };
  const accessToken = tokenData.access_token;
  if (!accessToken) {
    return NextResponse.redirect(new URL("/pl/pl/signin?error=no_token", baseUrl));
  }

  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!userRes.ok) {
    return NextResponse.redirect(new URL("/pl/pl/signin?error=userinfo", baseUrl));
  }

  const userData = (await userRes.json()) as { id?: string; name?: string; email?: string; picture?: string };
  const googleId = String(userData.id ?? "");
  const rawEmail = String(userData.email ?? "").trim();
  const email = rawEmail || `google-${googleId}@placeholder.local`;
  const name = String(userData.name ?? userData.email ?? "User").trim() || "User";
  const picture = userData.picture ? String(userData.picture) : null;

  const db = getDb();
  let dbUser = await db.query.users.findFirst({
    where: or(eq(users.googleId, googleId), eq(users.email, email)),
  });
  if (!dbUser) {
    const [inserted] = await db.insert(users).values({
      googleId: googleId || null,
      email,
      name,
      countryCode: "pl",
      createdAt: new Date(),
      role: "client",
    }).returning();
    if (!inserted) throw new Error("Insert user failed");
    dbUser = { ...inserted, googleId: inserted.googleId ?? (googleId || null) };
  } else if (!dbUser.googleId && googleId) {
    await db.update(users).set({ googleId, name }).where(eq(users.id, dbUser.id));
  }

  const sessionValue = encodeSession({
    userId: dbUser.id,
    id: googleId,
    name: dbUser.name,
    email: dbUser.email,
    picture,
  });
  const opts = sessionCookieOptions();
  const res = NextResponse.redirect(redirectUrl);
  res.cookies.set(opts.name, sessionValue, {
    path: opts.path,
    maxAge: opts.maxAge,
    httpOnly: opts.httpOnly,
    secure: opts.secure,
    sameSite: opts.sameSite,
  });
  return res;
  } catch (err) {
    console.error("[auth/callback/google]", err);
    return NextResponse.redirect(signinErrorUrl);
  }
}
