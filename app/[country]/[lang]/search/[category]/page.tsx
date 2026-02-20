import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { projects, users, proProfiles, cities } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { SearchContent } from "@/components/SearchContent";
import { isValidCategorySlug } from "@/lib/categories";

type PageProps = { params: Promise<{ category: string }>; searchParams: Promise<{ city?: string }> };

async function loadSearchData(country: string, category: string, city?: string) {
  const db = getDb();
  const projCond = [eq(projects.countryCode, country), eq(projects.categorySlug, category)];
  if (city) projCond.push(eq(projects.citySlug, city));
  const projectsRows = await db
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

  const prosCond = [eq(users.role, "pro"), eq(users.countryCode, country), eq(proProfiles.categorySlug, category)];
  if (city) prosCond.push(eq(proProfiles.citySlug, city));
  const prosRows = await db
    .select({
      id: proProfiles.id,
      userId: users.id,
      name: users.name,
      email: users.email,
      categorySlug: proProfiles.categorySlug,
      citySlug: proProfiles.citySlug,
      rating: proProfiles.rating,
      languages: proProfiles.languages,
      verified: proProfiles.verified,
      bio: proProfiles.bio,
    })
    .from(proProfiles)
    .innerJoin(users, eq(proProfiles.userId, users.id))
    .where(and(...prosCond))
    .limit(100);

  const pros = prosRows.map((r) => ({
    ...r,
    languages: JSON.parse(r.languages || "[]") as string[],
    verified: Boolean(r.verified),
  }));

  return { projects: projectsRows, pros };
}

export default async function SearchByCategoryPage({ params, searchParams }: PageProps) {
  const { category } = await params;
  const { city } = await searchParams;
  if (!isValidCategorySlug(category)) notFound();
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const country = pathname.split("/").filter(Boolean)[0] ?? "pl";
  let projects: Awaited<ReturnType<typeof loadSearchData>>["projects"] = [];
  let pros: Awaited<ReturnType<typeof loadSearchData>>["pros"] = [];
  let citiesList: { id: number; countryCode: string; slug: string }[] = [];
  try {
    const db = getDb();
    citiesList = await db.select().from(cities).where(eq(cities.countryCode, country));
    const data = await loadSearchData(country, category, city || undefined);
    projects = data.projects;
    pros = data.pros;
  } catch (_) {
    // DB not available (e.g. no data dir)
  }
  return <SearchContent category={category} city={city ?? ""} cities={citiesList} projects={projects} pros={pros} />;
}
