"use client";

import Link from "next/link";
import { useT, useLocalePath } from "./LocaleContext";

const BASE_URL = typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_APP_URL ?? "https://commo.cc").replace(/\/$/, "") : "https://commo.cc";

type ProjectRow = {
  id: number;
  title: string;
  description: string | null;
  status: string;
  categorySlug: string;
  citySlug?: string | null;
  clientName: string;
};

type Props = { projects: ProjectRow[] };

export function FeedOffers({ projects }: Props) {
  const t = useT();
  const path = useLocalePath();
  const list = projects.slice(0, 6);

  if (projects.length === 0) return null;

  const statusLabel = (status: string) =>
    status === "open" ? t("project.statusOpen") : t("project.statusClosed");

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("home.offersFeed"),
    numberOfItems: list.length,
    itemListElement: list.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Demand",
        name: p.title,
        description: p.description ?? undefined,
        url: `${BASE_URL}${path(`projects/${p.categorySlug}`).startsWith("/") ? path(`projects/${p.categorySlug}`) : `/${path(`projects/${p.categorySlug}`)}`}`,
      },
    })),
  };

  return (
    <section className="w-full max-w-4xl mx-auto mb-12" aria-label={t("home.offersFeed")}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <h2 className="text-lg font-medium text-graphite mb-4">{t("home.offersFeed")}</h2>
      <ul className="space-y-2">
        {list.map((p) => (
          <li key={p.id}>
            <Link
              href={path(`projects/${p.categorySlug}`)}
              className="block p-3 rounded-lg border border-gray-200 hover:border-accent hover:bg-gray-50"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="font-medium text-graphite text-sm">{p.title}</p>
              {p.description && <p className="text-xs text-gray-500 truncate mt-0.5">{p.description}</p>}
              <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                <span className={p.status === "open" ? "text-green-600 font-medium" : ""}>
                  {statusLabel(p.status)}
                </span>
                {p.citySlug && (
                  <span>· {t(`city.${p.citySlug}` as "city.warsaw")}</span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
