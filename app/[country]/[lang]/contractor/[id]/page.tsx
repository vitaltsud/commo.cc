import { notFound } from "next/navigation";
import { ContractorProfileContent } from "@/components/ContractorProfileContent";
import { loadProBySlug } from "@/lib/search-data";

type PageProps = { params: Promise<{ country: string; lang: string; id: string }> };

export default async function ContractorPage({ params }: PageProps) {
  const { country, id: slug } = await params;
  if (!slug || slug.length > 32) notFound();
  let pro: Awaited<ReturnType<typeof loadProBySlug>> = null;
  try {
    pro = await loadProBySlug(country, slug);
  } catch (_) {
    // DB not available
  }
  if (!pro) notFound();
  return <ContractorProfileContent pro={pro} />;
}
