import { SearchContent } from "@/components/SearchContent";

type SearchPageProps = { searchParams: { category?: string } };

export default function SearchPage({ searchParams }: SearchPageProps) {
  const category = searchParams.category ?? "";
  return <SearchContent category={category} />;
}
