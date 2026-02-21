"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Breadcrumbs, BREADCRUMBS_WEBSITE_ID } from "@/components/Breadcrumbs";
import { useT, useLocale } from "./LocaleContext";
import { localePath } from "@/lib/paths";

type ProjectRow = {
  id: number;
  title: string;
  description: string | null;
  status: string;
  categorySlug: string;
  citySlug?: string | null;
  createdAt: number | Date | null;
  clientName: string;
  clientEmail: string;
};

type CityRow = { id: number; countryCode: string; slug: string };

type Props = { category: string; city: string; cities: CityRow[]; projects: ProjectRow[] };

export function ProjectsByCategoryContent({ category, city, cities, projects }: Props) {
  const t = useT();
  const { countryCode, localeCode } = useLocale();
  const allCitiesHref = localePath(countryCode, localeCode, `projects/${category}`, null);
  const categoryLabel = t(`category.${category}` as "category.plumbing");
  const breadcrumbItems = [
    { label: t("breadcrumbs.home"), href: localePath(countryCode, localeCode, "", null) },
    { label: t("breadcrumbs.projects"), href: localePath(countryCode, localeCode, "", null) },
    { label: categoryLabel, href: localePath(countryCode, localeCode, `projects/${category}`, city || null) },
  ];
  const currentUrl = localePath(countryCode, localeCode, `projects/${category}`, city || null);
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "numberOfItems": projects.length,
    "itemListElement": projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Demand",
        name: p.title,
        description: p.description ?? undefined,
      },
    })),
  };
  const pageSchema = {
    name: `${t("search.projects")} · ${categoryLabel}`,
    url: currentUrl,
    isPartOf: { "@id": BREADCRUMBS_WEBSITE_ID },
    schemaType: "CollectionPage" as const,
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        <Breadcrumbs
          items={breadcrumbItems}
          pageSchema={pageSchema}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
        <h1 className="text-xl font-semibold text-graphite mb-4">
          {t("search.projects")} · {category}
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
                href={localePath(countryCode, localeCode, `projects/${category}`, c.slug)}
                className={`px-3 py-1.5 rounded-lg text-sm ${city === c.slug ? "bg-accent text-white" : "bg-gray-100 text-graphite hover:bg-gray-200"}`}
              >
                {t(`city.${c.slug}` as "city.warsaw")}
              </Link>
            ))}
          </div>
        )}

        {projects.length === 0 ? (
          <p className="text-gray-500">{t("search.noProjects")}</p>
        ) : (
          <ul className="space-y-3">
            {projects.map((p) => (
              <li key={p.id} className="p-4 border border-gray-200 rounded-lg">
                <p className="font-medium text-graphite">{p.title}</p>
                {p.description && <p className="text-sm text-gray-600 mt-1">{p.description}</p>}
                <p className="text-xs text-gray-500 mt-2">
                  {t("search.client")}: {p.clientName} · {p.status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
