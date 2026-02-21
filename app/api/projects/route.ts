import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { projects, users } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getCountryByCode } from "@/lib/countries";
import { isValidCategorySlug } from "@/lib/categories";
import { isCitySlug } from "@/lib/city-slugs";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const countryParam = searchParams.get("country") ?? "pl";
  const country = getCountryByCode(countryParam) ? countryParam : "pl";
  const categoryParam = searchParams.get("category");
  const category = categoryParam && isValidCategorySlug(categoryParam) ? categoryParam : undefined;
  const cityParam = searchParams.get("city");
  const city = cityParam && isCitySlug(country, cityParam) ? cityParam : undefined;

  const db = getDb();
  const cond = [eq(projects.countryCode, country)];
  if (category) cond.push(eq(projects.categorySlug, category));
  if (city) cond.push(eq(projects.citySlug, city));

  const rows = await db
    .select({
      id: projects.id,
      title: projects.title,
      description: projects.description,
      status: projects.status,
      categorySlug: projects.categorySlug,
      createdAt: projects.createdAt,
      clientName: users.name,
      clientEmail: users.email,
    })
    .from(projects)
    .innerJoin(users, eq(projects.clientId, users.id))
    .where(and(...cond))
    .orderBy(desc(projects.createdAt))
    .limit(100);

  return Response.json(rows);
}
