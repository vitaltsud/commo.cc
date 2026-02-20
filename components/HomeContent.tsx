"use client";

import { Header } from "@/components/Header";
import { CategoryGrid } from "@/components/CategoryGrid";
import { BrowseByRegionCategory } from "@/components/BrowseByRegionCategory";
import { FeedOffers } from "@/components/FeedOffers";
import { FeedMasters } from "@/components/FeedMasters";
import { useT } from "./LocaleContext";

type CityRow = { id: number; countryCode: string; slug: string };
type ProjectRow = { id: number; title: string; description: string | null; status: string; categorySlug: string; citySlug: string | null; clientName: string };
type ProRow = { id: number; name: string; categorySlug: string; citySlug: string | null; rating: number | null; languages: string; verified: boolean; languagesArr?: string[] };

type HomeContentProps = {
  cities?: CityRow[];
  recentProjects?: ProjectRow[];
  recentPros?: ProRow[];
};

export function HomeContent({ cities = [], recentProjects = [], recentPros = [] }: HomeContentProps) {
  const t = useT();
  const prosForFeed = recentPros.map((p) => ({
    id: p.id,
    name: p.name,
    categorySlug: p.categorySlug,
    citySlug: p.citySlug,
    rating: p.rating,
    languages: p.languagesArr ?? [],
    verified: p.verified,
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-semibold text-graphite text-center mb-4">
          {t("home.heroTitle")}
        </h1>
        <div className="w-full max-w-xl">
          <input
            type="search"
            placeholder={t("home.searchPlaceholder")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-graphite placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            aria-label={t("home.searchPlaceholder")}
          />
        </div>
        <p className="mt-6 text-sm text-gray-500 text-center">{t("home.orChooseCategory")}</p>
        <div className="w-full max-w-2xl mx-auto">
          <CategoryGrid />
        </div>

        {cities.length > 0 && <BrowseByRegionCategory cities={cities} />}
        <FeedOffers projects={recentProjects} />
        <FeedMasters pros={prosForFeed} />
      </main>
    </div>
  );
}
