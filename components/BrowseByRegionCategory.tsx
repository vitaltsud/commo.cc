"use client";

import Link from "next/link";
import { useT, useLocalePath } from "./LocaleContext";
import { categories } from "@/lib/categories";

type CityRow = { id: number; countryCode: string; slug: string };

type Props = { cities: CityRow[] };

export function BrowseByRegionCategory({ cities }: Props) {
  const t = useT();
  const path = useLocalePath();

  return (
    <section className="w-full max-w-4xl mx-auto mb-12">
      <h2 className="text-lg font-medium text-graphite mb-4">{t("home.browseByRegion")}</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm text-gray-500 mr-2">{t("search.filterCity")}:</span>
        {cities.map((c) => (
          <Link
            key={c.id}
            href={path(`projects/cleaning`)}
            className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 text-graphite hover:bg-gray-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t(`city.${c.slug}` as "city.warsaw")}
          </Link>
        ))}
      </div>
      <p className="text-sm text-gray-500 mb-2">{t("home.orChooseCategory")}</p>
      <div className="flex flex-wrap gap-2">
        {categories.slice(0, 6).map((cat) => (
          <Link
            key={cat.id}
            href={path(`projects/${cat.slug}`)}
            className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-graphite hover:border-accent hover:text-accent"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t(`category.${cat.id}`)}
          </Link>
        ))}
      </div>
    </section>
  );
}
