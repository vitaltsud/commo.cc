import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { cities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ContractorsByCategoryContent } from "@/components/ContractorsByCategoryContent";
import { loadProsByCategory } from "@/lib/search-data";
import { isValidCategorySlug } from "@/lib/categories";

type PageProps = { params: Promise<{ country: string; lang: string; category: string }> };

export default async function ContractorsCategoryPage({ params }: PageProps) {
  const { country, category } = await params;
  if (!isValidCategorySlug(category)) notFound();
  const headersList = await headers();
  const citySlug = headersList.get("x-city") ?? undefined;
  let pros: Awaited<ReturnType<typeof loadProsByCategory>> = [];
  let citiesList: { id: number; countryCode: string; slug: string }[] = [];
  try {
    const db = getDb();
    citiesList = await db.select().from(cities).where(eq(cities.countryCode, country));
    pros = await loadProsByCategory(country, category, citySlug);
  } catch (_) {
    // DB not available
  }
  return (
    <ContractorsByCategoryContent
      category={category}
      city={citySlug ?? ""}
      cities={citiesList}
      pros={pros}
    />
  );
}
