import { NextRequest, NextResponse } from "next/server";
import { sessionCookieOptions } from "@/lib/session";

export function GET(req: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = NextResponse.redirect(new URL("/pl/pl", baseUrl));
  const opts = sessionCookieOptions();
  res.cookies.set(opts.name, "", { path: opts.path, maxAge: 0 });
  return res;
}
