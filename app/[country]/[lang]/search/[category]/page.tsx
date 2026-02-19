import { notFound } from "next/navigation";
import { SearchContent } from "@/components/SearchContent";
import { isValidCategorySlug } from "@/lib/categories";

type PageProps = { params: Promise<{ category: string }> };

export default async function SearchByCategoryPage({ params }: PageProps) {
  const { category } = await params;
  if (!isValidCategorySlug(category)) notFound();
  return <SearchContent category={category} />;
}
