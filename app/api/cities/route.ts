import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { cities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCountryByCode } from "@/lib/countries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const countryParam = request.nextUrl.searchParams.get("country") ?? "pl";
  const country = getCountryByCode(countryParam) ? countryParam : "pl";
  const db = getDb();
  const rows = await db.select().from(cities).where(eq(cities.countryCode, country));
  return Response.json(rows);
}
