"use client";

import Link from "next/link";
import { useT, useLocalePath } from "./LocaleContext";
import { UserLanguagesBadge } from "./UserLanguagesBadge";
import type { LocaleCode } from "@/lib/countries";

const BASE_URL = typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_APP_URL ?? "https://commo.cc").replace(/\/$/, "") : "https://commo.cc";

type ProRow = {
  id: number;
  name: string;
  categorySlug: string;
  citySlugs: string[];
  rating: number | null;
  languages: string[];
  verified: boolean;
};

type Props = { pros: ProRow[] };

export function FeedMasters({ pros }: Props) {
  const t = useT();
  const path = useLocalePath();
  const list = pros.slice(0, 6);

  if (pros.length === 0) return null;

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("home.mastersFeed"),
    numberOfItems: list.length,
    itemListElement: list.map((pro, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Person",
        name: pro.name,
        url: `${BASE_URL}${path(`contractors/${pro.categorySlug}`).startsWith("/") ? path(`contractors/${pro.categorySlug}`) : `/${path(`contractors/${pro.categorySlug}`)}`}`,
      },
    })),
  };

  return (
    <section className="w-full max-w-4xl mx-auto mb-12" aria-label={t("home.mastersFeed")}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <h2 className="text-lg font-medium text-graphite mb-4">{t("home.mastersFeed")}</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {list.map((pro) => (
          <li key={pro.id}>
            <Link
              href={path(`contractors/${pro.categorySlug}`)}
              className="block p-4 rounded-lg border border-gray-200 hover:border-accent hover:bg-gray-50"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="font-medium text-graphite text-sm">
                {pro.name}
                {pro.verified && <span className="ml-1 text-accent">✓</span>}
              </p>
              {pro.citySlugs?.length > 0 && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {pro.citySlugs.map((s) => t(`city.${s}` as "city.warsaw")).join(", ")}
                </p>
              )}
              <div className="mt-1">
                <UserLanguagesBadge languages={pro.languages as LocaleCode[]} />
              </div>
              {pro.rating != null && (
                <p className="text-xs text-gray-500 mt-1">{pro.rating}/100</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
