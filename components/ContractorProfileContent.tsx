"use client";

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
  slug: string | null;
  categorySlug: string;
  citySlugs: string[];
  rating: number | null;
  languages: string[];
  verified: boolean;
  bio: string | null;
};

type Props = { pro: ProRow };

export function ContractorProfileContent({ pro }: Props) {
  const t = useT();
  const path = useLocalePath();
  const { countryCode, localeCode } = useLocale();
  const categoryLabel = t(`category.${pro.categorySlug}` as "category.plumbing");
  const profileUrl = path(`contractor/${pro.slug ?? pro.id}`);
  const breadcrumbItems = [
    { label: t("breadcrumbs.home"), href: localePath(countryCode, localeCode, "", null) },
    { label: t("breadcrumbs.contractors"), href: localePath(countryCode, localeCode, "", null) },
    { label: categoryLabel, href: localePath(countryCode, localeCode, `contractors/${pro.categorySlug}`, null) },
    { label: pro.name, href: profileUrl },
  ];
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: pro.name,
    description: pro.bio ?? undefined,
    url: `${BASE_URL}${profileUrl.startsWith("/") ? profileUrl : `/${profileUrl}`}`,
    isPartOf: { "@id": BREADCRUMBS_WEBSITE_ID },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        <Breadcrumbs
          items={breadcrumbItems}
          pageSchema={{ name: pro.name, url: profileUrl, isPartOf: { "@id": BREADCRUMBS_WEBSITE_ID } }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
        <div className="p-6 border border-gray-200 rounded-lg">
          <h1 className="text-2xl font-semibold text-graphite">
            {pro.name}
            {pro.verified && (
              <span className="ml-2 text-accent text-base" title={t("profile.verified")}>
                ✓
              </span>
            )}
          </h1>
          {pro.citySlugs?.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {pro.citySlugs.map((s) => t(`city.${s}` as "city.warsaw")).join(", ")}
            </p>
          )}
          <p className="text-sm text-gray-600 mt-2">{t(`category.${pro.categorySlug}` as "category.plumbing")}</p>
          {pro.bio && <p className="mt-4 text-graphite">{pro.bio}</p>}
          <div className="mt-4">
            <UserLanguagesBadge languages={pro.languages as LocaleCode[]} />
          </div>
          {pro.rating != null && (
            <p className="text-sm text-gray-500 mt-2">
              {t("profile.reviewsCount", { count: Math.floor(pro.rating / 20) })} · {pro.rating}/100
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
