import { headers } from "next/headers";
import { getDb } from "@/db";
import { projects, users } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { ProjectsListContent } from "@/components/ProjectsListContent";

type PageProps = { params: Promise<{ country: string; lang: string }> };

export default async function ProjectsPage({ params }: PageProps) {
  const { country } = await params;
  const headersList = await headers();
  const citySlug = headersList.get("x-city") ?? null;
  let list: { id: number; title: string; description: string | null; status: string; categorySlug: string; citySlug: string | null; clientName: string }[] = [];

  try {
    const db = getDb();
    const cond = citySlug
      ? and(eq(projects.countryCode, country), eq(projects.citySlug, citySlug))
      : eq(projects.countryCode, country);
    const rows = await db
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
      .where(cond)
      .orderBy(desc(projects.createdAt))
      .limit(100);
    list = rows;
  } catch (_) {}

  return <ProjectsListContent projects={list} />;
}
