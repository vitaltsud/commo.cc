"use client";

import Link from "next/link";
import { useT, useLocalePath } from "./LocaleContext";

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

  if (projects.length === 0) return null;

  const statusLabel = (status: string) =>
    status === "open" ? t("project.statusOpen") : t("project.statusClosed");

  return (
    <section className="w-full max-w-4xl mx-auto mb-12">
      <h2 className="text-lg font-medium text-graphite mb-4">{t("home.offersFeed")}</h2>
      <ul className="space-y-2">
        {projects.slice(0, 6).map((p) => (
          <li key={p.id}>
            <Link
              href={path(`search/${p.categorySlug}`)}
              className="block p-3 rounded-lg border border-gray-200 hover:border-accent hover:bg-gray-50"
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
