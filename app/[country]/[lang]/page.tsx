import { getDb } from "@/db";
import { cities, projects, users, proProfiles } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { HomeContent } from "@/components/HomeContent";

type PageProps = { params: Promise<{ country: string; lang: string }> };

export default async function HomePage({ params }: PageProps) {
  const { country } = await params;
  let citiesList: { id: number; countryCode: string; slug: string }[] = [];
  let recentProjects: { id: number; title: string; description: string | null; status: string; categorySlug: string; citySlug: string | null; clientName: string }[] = [];
  let recentPros: { id: number; name: string; categorySlug: string; citySlug: string | null; rating: number | null; languages: string; verified: boolean; languagesArr?: string[] }[] = [];

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

    const prosRows = await db
      .select({
        id: proProfiles.id,
        name: users.name,
        categorySlug: proProfiles.categorySlug,
        citySlug: proProfiles.citySlug,
        rating: proProfiles.rating,
        languages: proProfiles.languages,
        verified: proProfiles.verified,
      })
      .from(proProfiles)
      .innerJoin(users, eq(proProfiles.userId, users.id))
      .where(and(eq(users.role, "pro"), eq(users.countryCode, country)))
      .limit(6);
    recentPros = prosRows.map((r) => ({
      ...r,
      verified: Boolean(r.verified),
      languagesArr: JSON.parse(r.languages || "[]") as string[],
    }));
  } catch (_) {}

  return (
    <HomeContent
      cities={citiesList}
      recentProjects={recentProjects}
      recentPros={recentPros}
    />
  );
}
