import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { cities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProjectsByCategoryContent } from "@/components/ProjectsByCategoryContent";
import { loadProjectsByCategory } from "@/lib/search-data";
import { isValidCategorySlug } from "@/lib/categories";

type PageProps = { params: Promise<{ country: string; lang: string; category: string }> };

export default async function ProjectsCategoryPage({ params }: PageProps) {
  const { country, category } = await params;
  if (!isValidCategorySlug(category)) notFound();
  const headersList = await headers();
  const citySlug = headersList.get("x-city") ?? undefined;
  let projects: Awaited<ReturnType<typeof loadProjectsByCategory>> = [];
  let citiesList: { id: number; countryCode: string; slug: string }[] = [];
  try {
    const db = getDb();
    citiesList = await db.select().from(cities).where(eq(cities.countryCode, country));
    projects = await loadProjectsByCategory(country, category, citySlug);
  } catch (_) {
    // DB not available
  }
  return (
    <ProjectsByCategoryContent
      category={category}
      city={citySlug ?? ""}
      cities={citiesList}
      projects={projects}
    />
  );
}
