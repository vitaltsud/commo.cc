import { NextResponse } from "next/server";

const baseUrl = () => process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export function GET() {
  return NextResponse.redirect(new URL("/signin", baseUrl()));
}
