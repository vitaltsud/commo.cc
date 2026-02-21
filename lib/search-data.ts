import { getDb } from "@/db";
import { projects, users, proProfiles, proProfileCities } from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";

export async function loadProjectsByCategory(country: string, category: string, city?: string) {
  const db = getDb();
  const projCond = [eq(projects.countryCode, country), eq(projects.categorySlug, category)];
  if (city) projCond.push(eq(projects.citySlug, city));
  return db
    .select({
      id: projects.id,
      title: projects.title,
      description: projects.description,
      status: projects.status,
      categorySlug: projects.categorySlug,
      citySlug: projects.citySlug,
      createdAt: projects.createdAt,
      clientName: users.name,
      clientEmail: users.email,
    })
    .from(projects)
    .innerJoin(users, eq(projects.clientId, users.id))
    .where(and(...projCond))
    .orderBy(desc(projects.createdAt))
    .limit(100);
}

export async function loadProsByCategory(country: string, category: string, city?: string) {
  const db = getDb();
  const baseCond = and(
    eq(proProfiles.verified, true),
    eq(users.countryCode, country),
    eq(proProfiles.categorySlug, category)
  );

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
          slug: proProfiles.slug,
        })
        .from(proProfiles)
        .innerJoin(users, eq(proProfiles.userId, users.id))
        .innerJoin(proProfileCities, eq(proProfileCities.proProfileId, proProfiles.id))
        .where(and(baseCond, eq(proProfileCities.citySlug, city)))
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
          slug: proProfiles.slug,
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
    const list = citiesByProId.get(c.proProfileId) ?? [];
    list.push(c.citySlug);
    citiesByProId.set(c.proProfileId, list);
  }

  return rows.map((r) => ({
    ...r,
    citySlugs: citiesByProId.get(r.id) ?? [],
    languages: JSON.parse(r.languages || "[]") as string[],
    verified: Boolean(r.verified),
  }));
}

export async function loadProBySlug(country: string, slug: string) {
  const db = getDb();
  const rows = await db
    .select({
      id: proProfiles.id,
      userId: users.id,
      name: users.name,
      email: users.email,
      slug: proProfiles.slug,
      categorySlug: proProfiles.categorySlug,
      rating: proProfiles.rating,
      languages: proProfiles.languages,
      verified: proProfiles.verified,
      bio: proProfiles.bio,
    })
    .from(proProfiles)
    .innerJoin(users, eq(proProfiles.userId, users.id))
    .where(and(eq(users.countryCode, country), eq(proProfiles.slug, slug)))
    .limit(1);
  const r = rows[0];
  if (!r) return null;
  const cityRows = await db
    .select({ citySlug: proProfileCities.citySlug })
    .from(proProfileCities)
    .where(eq(proProfileCities.proProfileId, r.id));
  return {
    ...r,
    citySlugs: cityRows.map((c) => c.citySlug),
    languages: JSON.parse(r.languages || "[]") as string[],
    verified: Boolean(r.verified),
  };
}
