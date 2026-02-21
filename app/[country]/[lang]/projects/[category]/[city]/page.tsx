import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { cities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProjectsByCategoryContent } from "@/components/ProjectsByCategoryContent";
import { loadProjectsByCategory } from "@/lib/search-data";
import { isValidCategorySlug } from "@/lib/categories";
import { isCitySlug } from "@/lib/city-slugs";

type PageProps = { params: Promise<{ country: string; lang: string; category: string; city: string }> };

export default async function ProjectsCategoryCityPage({ params }: PageProps) {
  const { country, category, city } = await params;
  if (!isValidCategorySlug(category)) notFound();
  if (!isCitySlug(country, city)) notFound();
  const headersList = await headers();
  const citySlug = headersList.get("x-city") ?? city;
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
      city={citySlug ?? city}
      cities={citiesList}
      projects={projects}
    />
  );
}
