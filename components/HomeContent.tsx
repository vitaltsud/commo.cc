"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Breadcrumbs, BREADCRUMBS_WEBSITE_ID } from "@/components/Breadcrumbs";
import { CategoryGrid } from "@/components/CategoryGrid";
import { BrowseByRegionCategory } from "@/components/BrowseByRegionCategory";
import { FeedOffers } from "@/components/FeedOffers";
import { FeedMasters } from "@/components/FeedMasters";
import { UserLanguagesBadge } from "@/components/UserLanguagesBadge";
import { useT, useLocalePath } from "./LocaleContext";
import type { LocaleCode } from "@/lib/countries";

type CityRow = { id: number; countryCode: string; slug: string };
type ProjectRow = { id: number; title: string; description: string | null; status: string; categorySlug: string; citySlug: string | null; clientName: string };
type ProRow = { id: number; name: string; categorySlug: string; citySlugs: string[]; rating: number | null; languages: string; verified: boolean; languagesArr?: string[] };
type ProRowFull = ProRow & { slug: string | null };

type HomeContentProps = {
  cities?: CityRow[];
  recentProjects?: ProjectRow[];
  recentPros?: ProRow[];
  allProjects?: ProjectRow[];
  allPros?: ProRowFull[];
};

export function HomeContent({ cities = [], recentProjects = [], recentPros = [], allProjects = [], allPros = [] }: HomeContentProps) {
  const t = useT();
  const path = useLocalePath();
  const breadcrumbItems = [{ label: t("breadcrumbs.home"), href: path("") }];
  const prosForFeed = recentPros.map((p) => ({
    id: p.id,
    name: p.name,
    categorySlug: p.categorySlug,
    citySlugs: p.citySlugs ?? [],
    rating: p.rating,
    languages: p.languagesArr ?? [],
    verified: p.verified,
  }));
  const statusLabel = (status: string) => (status === "open" ? t("project.statusOpen") : t("project.statusClosed"));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center px-4 py-6 sm:py-8 md:py-16">
        <div className="w-full max-w-4xl mx-auto mb-2 sm:mb-4">
          <Breadcrumbs
            items={breadcrumbItems}
            pageSchema={{
              name: t("home.heroTitle"),
              url: path(""),
              isPartOf: { "@id": BREADCRUMBS_WEBSITE_ID },
            }}
          />
        </div>

        <section className="w-full max-w-6xl mx-auto mb-8 sm:mb-12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 md:gap-12" aria-label={t("home.sectionProjectsContractors")}>
          <div id="home-projects" className="rounded-xl border border-gray-200 bg-gray-50/50 p-3 sm:p-4 md:p-6 scroll-mt-20">
            <h2 className="text-lg font-semibold text-graphite mb-3 sm:mb-4">{t("home.projectsSectionTitle")}</h2>
            <ul className="space-y-2 max-h-[280px] sm:max-h-[320px] overflow-y-auto">
              {allProjects.length === 0 ? (
                <li className="text-sm text-gray-500 py-4">{t("search.noProjects")}</li>
              ) : (
                allProjects.map((p) => (
                  <li key={p.id}>
                    <div className="block p-3 sm:p-2.5 rounded-lg border border-gray-100 bg-white hover:border-gray-200 text-sm min-h-[44px] flex flex-col justify-center">
                      <p className="font-medium text-graphite">{p.title}</p>
                      {p.description && <p className="text-xs text-gray-500 truncate mt-0.5">{p.description}</p>}
                      <div className="flex flex-wrap gap-2 mt-1.5 text-xs text-gray-500 items-center">
                        <Link
                          href={path(`projects/${p.categorySlug}`)}
                          className="text-accent hover:underline font-medium"
                        >
                          {t(`category.${p.categorySlug}` as "category.cleaning")}
                        </Link>
                        <span className={p.status === "open" ? "text-green-600 font-medium" : ""}>{statusLabel(p.status)}</span>
                        {p.citySlug && <span>· {t(`city.${p.citySlug}` as "city.warsaw")}</span>}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div id="home-contractors" className="rounded-xl border border-gray-200 bg-gray-50/50 p-3 sm:p-4 md:p-6 scroll-mt-20">
            <h2 className="text-lg font-semibold text-graphite mb-3 sm:mb-4">{t("home.contractorsSectionTitle")}</h2>
            <ul className="space-y-2 max-h-[280px] sm:max-h-[320px] overflow-y-auto">
              {allPros.length === 0 ? (
                <li className="text-sm text-gray-500 py-4">{t("search.noPros")}</li>
              ) : (
                allPros.map((pro) => (
                  <li key={pro.id}>
                    <Link
                      href={pro.slug ? path(`contractor/${pro.slug}`) : path(`contractors/${pro.categorySlug}`)}
                      className="block p-3 sm:p-2.5 rounded-lg border border-gray-100 bg-white hover:border-accent hover:bg-gray-50 text-sm min-h-[44px]"
                    >
                      <p className="font-medium text-graphite">
                        {pro.name}
                        {pro.verified && <span className="ml-1 text-accent">✓</span>}
                      </p>
                      {pro.citySlugs?.length > 0 && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {pro.citySlugs.map((s) => t(`city.${s}` as "city.warsaw")).join(", ")}
                        </p>
                      )}
                      <div className="mt-1">
                        <UserLanguagesBadge languages={(pro.languagesArr ?? []) as LocaleCode[]} />
                      </div>
                      {pro.rating != null && <p className="text-xs text-gray-500 mt-0.5">{pro.rating}/100</p>}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-graphite text-center mb-3 sm:mb-4 px-2">
          {t("home.heroTitle")}
        </h1>
        <div className="w-full max-w-xl px-0 sm:px-0">
          <input
            type="search"
            placeholder={t("home.searchPlaceholder")}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg text-graphite placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent min-h-[44px]"
            aria-label={t("home.searchPlaceholder")}
          />
        </div>
        <p className="mt-6 text-sm text-gray-500 text-center">{t("home.orChooseCategory")}</p>

        <div className="w-full max-w-2xl mx-auto mt-4 sm:mt-6 px-0">
          <CategoryGrid />
        </div>

        <section className="w-full max-w-4xl mx-auto mt-10 sm:mt-16 md:mt-20 px-2" aria-labelledby="home-benefits-title">
          <h2 id="home-benefits-title" className="text-xl sm:text-2xl md:text-3xl font-semibold text-graphite text-center mb-6 sm:mb-10">
            {t("home.benefits.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 md:gap-12">
            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-graphite mb-4">{t("home.benefits.forClients")}</h3>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">✓</span>
                  {t("home.benefits.client1")}
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">✓</span>
                  {t("home.benefits.client2")}
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">✓</span>
                  {t("home.benefits.client3")}
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">✓</span>
                  {t("home.benefits.client4")}
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-graphite mb-4">{t("home.benefits.forPros")}</h3>
              <ul className="space-y-3 text-gray-700 text-sm">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">✓</span>
                  {t("home.benefits.pro1")}
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">✓</span>
                  {t("home.benefits.pro2")}
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">✓</span>
                  {t("home.benefits.pro3")}
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">✓</span>
                  {t("home.benefits.pro4")}
                </li>
              </ul>
            </div>
          </div>
        </section>

        {cities.length > 0 && <BrowseByRegionCategory cities={cities} />}
        <FeedOffers projects={recentProjects} />
        <FeedMasters pros={prosForFeed} />
      </main>
    </div>
  );
}
