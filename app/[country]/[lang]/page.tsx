import { headers } from "next/headers";
import { getDb } from "@/db";
import { cities, projects, users, proProfiles, proProfileCities } from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { HomeContent } from "@/components/HomeContent";

type PageProps = { params: Promise<{ country: string; lang: string }> };

export default async function HomePage({ params }: PageProps) {
  const { country } = await params;
  const headersList = await headers();
  const citySlug = headersList.get("x-city") ?? null;
  let citiesList: { id: number; countryCode: string; slug: string }[] = [];
  let recentProjects: { id: number; title: string; description: string | null; status: string; categorySlug: string; citySlug: string | null; clientName: string }[] = [];
  let recentPros: { id: number; name: string; categorySlug: string; citySlugs: string[]; rating: number | null; languages: string; verified: boolean; languagesArr?: string[] }[] = [];
  let allProjects: { id: number; title: string; description: string | null; status: string; categorySlug: string; citySlug: string | null; clientName: string }[] = [];
  let allPros: { id: number; name: string; slug: string | null; categorySlug: string; citySlugs: string[]; rating: number | null; languages: string; verified: boolean; languagesArr?: string[] }[] = [];

  try {
    const db = getDb();
    citiesList = await db.select().from(cities).where(eq(cities.countryCode, country));

    const projRows = await db
      .select({
        id: projects.id,
        title: projects.title,
        description: projects.description,
        status: projects.status,
        categorySlug: projects.categorySlug,
        citySlug: projects.citySlug,
        clientName: users.name,
      })
      .from(projects)
      .innerJoin(users, eq(projects.clientId, users.id))
      .where(eq(projects.countryCode, country))
      .orderBy(desc(projects.createdAt))
      .limit(6);
    recentProjects = projRows;

    const allProjCond = citySlug
      ? and(eq(projects.countryCode, country), eq(projects.citySlug, citySlug))
      : eq(projects.countryCode, country);
    const allProjRows = await db
      .select({
        id: projects.id,
        title: projects.title,
        description: projects.description,
        status: projects.status,
        categorySlug: projects.categorySlug,
        citySlug: projects.citySlug,
        clientName: users.name,
      })
      .from(projects)
      .innerJoin(users, eq(projects.clientId, users.id))
      .where(allProjCond)
      .orderBy(desc(projects.createdAt))
      .limit(50);
    allProjects = allProjRows;

    const prosRows = await db
      .select({
        id: proProfiles.id,
        name: users.name,
        categorySlug: proProfiles.categorySlug,
        rating: proProfiles.rating,
        languages: proProfiles.languages,
        verified: proProfiles.verified,
      })
      .from(proProfiles)
      .innerJoin(users, eq(proProfiles.userId, users.id))
      .where(and(eq(proProfiles.verified, true), eq(users.countryCode, country)))
      .limit(6);
    const ids = prosRows.map((r) => r.id);
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
    recentPros = prosRows.map((r) => ({
      ...r,
      citySlugs: citiesByProId.get(r.id) ?? [],
      verified: Boolean(r.verified),
      languagesArr: JSON.parse(r.languages || "[]") as string[],
    }));

    const allProsBaseCond = and(eq(proProfiles.verified, true), eq(users.countryCode, country));
    const allProsRows = citySlug
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
          .where(and(allProsBaseCond, eq(proProfileCities.citySlug, citySlug)))
          .limit(50)
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
          .where(allProsBaseCond)
          .limit(50);
    const allIds = allProsRows.map((r) => r.id);
    const allCityRows =
      allIds.length > 0
        ? await db
            .select({ proProfileId: proProfileCities.proProfileId, citySlug: proProfileCities.citySlug })
            .from(proProfileCities)
            .where(inArray(proProfileCities.proProfileId, allIds))
        : [];
    const allCitiesByProId = new Map<number, string[]>();
    for (const c of allCityRows) {
      const list = allCitiesByProId.get(c.proProfileId) ?? [];
      list.push(c.citySlug);
      allCitiesByProId.set(c.proProfileId, list);
    }
    allPros = allProsRows.map((r) => ({
      ...r,
      citySlugs: allCitiesByProId.get(r.id) ?? [],
      verified: Boolean(r.verified),
      languagesArr: JSON.parse(r.languages || "[]") as string[],
    }));
  } catch (_) {}

  return (
    <HomeContent
      cities={citiesList}
      recentProjects={recentProjects}
      recentPros={recentPros}
      allProjects={allProjects}
      allPros={allPros}
    />
  );
}
