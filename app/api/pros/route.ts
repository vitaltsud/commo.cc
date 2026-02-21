import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { users, proProfiles, proProfileCities } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
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
  const baseCond = and(eq(proProfiles.verified, true), eq(users.countryCode, country));
  const cond = category ? and(baseCond, eq(proProfiles.categorySlug, category)) : baseCond;

  const rows = city
    ? await db
        .selectDistinct({
          id: proProfiles.id,
          userId: users.id,
          name: users.name,
          email: users.email,
          categorySlug: proProfiles.categorySlug,
          rating: proProfiles.rating,
          languages: proProfiles.languages,
          verified: proProfiles.verified,
          bio: proProfiles.bio,
        })
        .from(proProfiles)
        .innerJoin(users, eq(proProfiles.userId, users.id))
        .innerJoin(proProfileCities, eq(proProfileCities.proProfileId, proProfiles.id))
        .where(and(cond, eq(proProfileCities.citySlug, city)))
        .limit(100)
    : await db
        .select({
          id: proProfiles.id,
          userId: users.id,
          name: users.name,
          email: users.email,
          categorySlug: proProfiles.categorySlug,
          rating: proProfiles.rating,
          languages: proProfiles.languages,
          verified: proProfiles.verified,
          bio: proProfiles.bio,
        })
        .from(proProfiles)
        .innerJoin(users, eq(proProfiles.userId, users.id))
        .where(cond)
        .limit(100);

  const ids = rows.map((r) => r.id);
  const cityRows =
    ids.length > 0
      ? await db
          .select({ proProfileId: proProfileCities.proProfileId, citySlug: proProfileCities.citySlug })
          .from(proProfileCities)
          .where(inArray(proProfileCities.proProfileId, ids))
      : [];
  const citiesByProId = new Map<number, string[]>();
  for (const c of cityRows) {
    const list = citiesByProId.get(c.proProfileId) ?? [];
    list.push(c.citySlug);
    citiesByProId.set(c.proProfileId, list);
  }

  const out = rows.map((r) => ({
    ...r,
    citySlugs: citiesByProId.get(r.id) ?? [],
    languages: JSON.parse(r.languages || "[]") as string[],
    verified: Boolean(r.verified),
  }));

  return Response.json(out);
}
