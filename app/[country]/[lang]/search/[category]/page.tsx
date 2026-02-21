import { redirect } from "next/navigation";
import { isValidCategorySlug } from "@/lib/categories";

type PageProps = { params: Promise<{ country: string; lang: string; category: string }> };

/** Legacy: /country/lang/search/category → redirect to /country/city/projects/category or /country/lang/city/projects/category */
export default async function SearchByCategoryPage({ params }: PageProps) {
  const { country, lang, category } = await params;
  if (!isValidCategorySlug(category)) redirect(`/${country}/${lang}`);
  redirect(`/${country}/${lang}/projects/${category}`);
}
