import { headers } from "next/headers";
import { getDb } from "@/db";
import { users, proProfiles, proProfileCities } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { ContractorsListContent } from "@/components/ContractorsListContent";

type PageProps = { params: Promise<{ country: string; lang: string }> };

export default async function ContractorsPage({ params }: PageProps) {
  const { country } = await params;
  const headersList = await headers();
  const citySlug = headersList.get("x-city") ?? null;
  let list: { id: number; name: string; slug: string | null; categorySlug: string; citySlugs: string[]; rating: number | null; languages: string; verified: boolean; languagesArr?: string[] }[] = [];

  try {
    const db = getDb();
    const baseCond = and(eq(proProfiles.verified, true), eq(users.countryCode, country));
    const rows = citySlug
      ? await db
          .selectDistinct({
            id: proProfiles.id,
            name: users.name,
            slug: proProfiles.slug,
            categorySlug: proProfiles.categorySlug,
            rating: proProfiles.rating,
            languages: proProfiles.languages,
            verified: proProfiles.verified,
          })
          .from(proProfiles)
          .innerJoin(users, eq(proProfiles.userId, users.id))
          .innerJoin(proProfileCities, eq(proProfileCities.proProfileId, proProfiles.id))
          .where(and(baseCond, eq(proProfileCities.citySlug, citySlug)))
          .limit(100)
      : await db
          .select({
            id: proProfiles.id,
            name: users.name,
            slug: proProfiles.slug,
            categorySlug: proProfiles.categorySlug,
            rating: proProfiles.rating,
            languages: proProfiles.languages,
            verified: proProfiles.verified,
          })
          .from(proProfiles)
          .innerJoin(users, eq(proProfiles.userId, users.id))
          .where(baseCond)
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
      const arr = citiesByProId.get(c.proProfileId) ?? [];
      arr.push(c.citySlug);
      citiesByProId.set(c.proProfileId, arr);
    }
    list = rows.map((r) => ({
      ...r,
      citySlugs: citiesByProId.get(r.id) ?? [],
      verified: Boolean(r.verified),
      languagesArr: JSON.parse(r.languages || "[]") as string[],
    }));
  } catch (_) {}

  return <ContractorsListContent pros={list} />;
}
