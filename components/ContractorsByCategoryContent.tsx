"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Breadcrumbs, BREADCRUMBS_WEBSITE_ID } from "@/components/Breadcrumbs";
import { useT, useLocalePath, useLocale } from "./LocaleContext";
import { localePath } from "@/lib/paths";
import { UserLanguagesBadge } from "./UserLanguagesBadge";
import type { LocaleCode } from "@/lib/countries";

const BASE_URL = typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_APP_URL ?? "https://commo.cc").replace(/\/$/, "") : "https://commo.cc";

type ProRow = {
  id: number;
  userId: number;
  name: string;
  email: string;
  categorySlug: string;
  citySlugs: string[];
  rating: number | null;
  languages: string[];
  verified: boolean;
  bio: string | null;
  slug: string | null;
};

type CityRow = { id: number; countryCode: string; slug: string };

type Props = { category: string; city: string; cities: CityRow[]; pros: ProRow[] };

export function ContractorsByCategoryContent({ category, city, cities, pros }: Props) {
  const t = useT();
  const path = useLocalePath();
  const { countryCode, localeCode } = useLocale();
  const allCitiesHref = localePath(countryCode, localeCode, `contractors/${category}`, null);
  const categoryLabel = t(`category.${category}` as "category.plumbing");
  const breadcrumbItems = [
    { label: t("breadcrumbs.home"), href: localePath(countryCode, localeCode, "", null) },
    { label: t("breadcrumbs.contractors"), href: localePath(countryCode, localeCode, "", null) },
    { label: categoryLabel, href: localePath(countryCode, localeCode, `contractors/${category}`, city || null) },
  ];
  const currentUrl = localePath(countryCode, localeCode, `contractors/${category}`, city || null);
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: pros.length,
    itemListElement: pros.map((pro, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Person",
        name: pro.name,
        url: `${BASE_URL}${path(`contractor/${pro.slug ?? pro.id}`).startsWith("/") ? path(`contractor/${pro.slug ?? pro.id}`) : `/${path(`contractor/${pro.slug ?? pro.id}`)}`}`,
        description: pro.bio ?? undefined,
      },
    })),
  };
  const pageSchema = {
    name: `${t("search.pros")} · ${categoryLabel}`,
    url: currentUrl,
    isPartOf: { "@id": BREADCRUMBS_WEBSITE_ID },
    schemaType: "CollectionPage" as const,
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} pageSchema={pageSchema} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
        <h1 className="text-xl font-semibold text-graphite mb-4">
          {t("search.pros")} · {category}
        </h1>

        {cities.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-graphite">{t("search.filterCity")}:</span>
            <Link
              href={allCitiesHref}
              className={`px-3 py-1.5 rounded-lg text-sm ${!city ? "bg-accent text-white" : "bg-gray-100 text-graphite hover:bg-gray-200"}`}
            >
              {t("search.allCities")}
            </Link>
            {cities.map((c) => (
              <Link
                key={c.id}
                href={localePath(countryCode, localeCode, `contractors/${category}`, c.slug)}
                className={`px-3 py-1.5 rounded-lg text-sm ${city === c.slug ? "bg-accent text-white" : "bg-gray-100 text-graphite hover:bg-gray-200"}`}
              >
                {t(`city.${c.slug}` as "city.warsaw")}
              </Link>
            ))}
          </div>
        )}

        {pros.length === 0 ? (
          <p className="text-gray-500">{t("search.noPros")}</p>
        ) : (
          <ul className="space-y-3">
            {pros.map((pro) => (
              <li key={pro.id}>
                <Link
                  href={path(`contractor/${pro.slug ?? pro.id}`)}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-accent hover:bg-gray-50"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p className="font-medium text-graphite">
                    {pro.name}
                    {pro.verified && (
                      <span className="ml-2 text-accent text-sm" title={t("profile.verified")}>
                        ✓
                      </span>
                    )}
                  </p>
                  {pro.bio && <p className="text-sm text-gray-600 mt-1">{pro.bio}</p>}
                  <div className="mt-2">
                    <UserLanguagesBadge languages={pro.languages as LocaleCode[]} />
                  </div>
                  {pro.rating != null && (
                    <p className="text-xs text-gray-500 mt-1">
                      {t("profile.reviewsCount", { count: Math.floor(pro.rating / 20) })} · {pro.rating}/100
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
