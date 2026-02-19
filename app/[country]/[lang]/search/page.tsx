import { SearchContent } from "@/components/SearchContent";

type SearchPageProps = { searchParams: Promise<{ category?: string }> };

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const category = params.category ?? "";
  return <SearchContent category={category} />;
}
