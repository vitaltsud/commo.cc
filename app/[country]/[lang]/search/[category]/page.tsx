import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { projects, users, proProfiles } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { SearchContent } from "@/components/SearchContent";
import { isValidCategorySlug } from "@/lib/categories";

type PageProps = { params: Promise<{ category: string }> };

async function loadSearchData(country: string, category: string) {
  const db = getDb();
  const projectsRows = await db
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
    .where(and(eq(projects.countryCode, country), eq(projects.categorySlug, category)))
    .orderBy(desc(projects.createdAt))
    .limit(100);

  const prosRows = await db
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
    .where(and(eq(users.role, "pro"), eq(users.countryCode, country), eq(proProfiles.categorySlug, category)))
    .limit(100);

  const pros = prosRows.map((r) => ({
    ...r,
    languages: JSON.parse(r.languages || "[]") as string[],
    verified: Boolean(r.verified),
  }));

  return { projects: projectsRows, pros };
}

export default async function SearchByCategoryPage({ params }: PageProps) {
  const { category } = await params;
  if (!isValidCategorySlug(category)) notFound();
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const country = pathname.split("/").filter(Boolean)[0] ?? "pl";
  let projects: Awaited<ReturnType<typeof loadSearchData>>["projects"] = [];
  let pros: Awaited<ReturnType<typeof loadSearchData>>["pros"] = [];
  try {
    const data = await loadSearchData(country, category);
    projects = data.projects;
    pros = data.pros;
  } catch (_) {
    // DB not available (e.g. no data dir)
  }
  return <SearchContent category={category} projects={projects} pros={pros} />;
}
