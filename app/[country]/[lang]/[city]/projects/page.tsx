import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { projects, users } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { ProjectsListContent } from "@/components/ProjectsListContent";
import { isCitySlug } from "@/lib/city-slugs";

type PageProps = { params: Promise<{ country: string; lang: string; city: string }> };

export default async function CityProjectsPage({ params }: PageProps) {
  const { country, city } = await params;
  if (!isCitySlug(country, city)) notFound();
  let list: Awaited<ReturnType<typeof loadProjects>> = [];

  try {
    list = await loadProjects(country, city);
  } catch (_) {}

  return <ProjectsListContent projects={list} />;
}

async function loadProjects(country: string, city: string) {
  const db = getDb();
  return db
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
    .where(and(eq(projects.countryCode, country), eq(projects.citySlug, city)))
    .orderBy(desc(projects.createdAt))
    .limit(100);
}
