"use client";

import { Header } from "@/components/Header";
import { useT } from "./LocaleContext";
import { UserLanguagesBadge } from "./UserLanguagesBadge";
import type { LocaleCode } from "@/lib/countries";

type SearchContentProps = { category: string };

export function SearchContent({ category }: SearchContentProps) {
  const t = useT();
  const title = category ? `${t("home.orChooseCategory")}: ${category}` : t("search.searchResults");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold text-graphite mb-4">{title}</h1>
        <p className="text-gray-500 mb-6">{t("search.resultsComingNext")}</p>
        <p className="text-sm text-graphite mb-2">{t("search.exampleLanguagesShown")}</p>
        <div className="p-4 border border-gray-200 rounded-lg max-w-md mb-4">
          <p className="font-medium text-graphite mb-1">{t("search.sampleProClientCard")}</p>
          <UserLanguagesBadge languages={["pl", "en", "ru", "uk"] as LocaleCode[]} />
        </div>
        <p className="text-sm text-graphite mb-2">{t("search.pluralReviews")}</p>
        <ul className="text-sm text-graphite list-disc list-inside mb-2">
          <li>0 → {t("profile.reviewsCount", { count: 0 })}</li>
          <li>1 → {t("profile.reviewsCount", { count: 1 })}</li>
          <li>2 → {t("profile.reviewsCount", { count: 2 })}</li>
          <li>5 → {t("profile.reviewsCount", { count: 5 })}</li>
        </ul>
      </main>
    </div>
  );
}
