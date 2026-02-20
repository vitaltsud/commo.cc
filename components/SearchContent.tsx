"use client";

import { Header } from "@/components/Header";
import { useT } from "./LocaleContext";
import { UserLanguagesBadge } from "./UserLanguagesBadge";
import type { LocaleCode } from "@/lib/countries";

type ProjectRow = {
  id: number;
  title: string;
  description: string | null;
  status: string;
  categorySlug: string;
  createdAt: number | Date | null;
  clientName: string;
  clientEmail: string;
};

type ProRow = {
  id: number;
  userId: number;
  name: string;
  email: string;
  categorySlug: string;
  rating: number | null;
  languages: string[];
  verified: boolean;
  bio: string | null;
};

type SearchContentProps = {
  category: string;
  projects: ProjectRow[];
  pros: ProRow[];
};

export function SearchContent({ category, projects, pros }: SearchContentProps) {
  const t = useT();
  const title = category ? `${t("home.orChooseCategory")}: ${category}` : t("search.searchResults");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold text-graphite mb-6">{title}</h1>

        <section className="mb-10">
          <h2 className="text-lg font-medium text-graphite mb-3">{t("search.projects")}</h2>
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
        </section>

        <section>
          <h2 className="text-lg font-medium text-graphite mb-3">{t("search.pros")}</h2>
          {pros.length === 0 ? (
            <p className="text-gray-500">{t("search.noPros")}</p>
          ) : (
            <ul className="space-y-3">
              {pros.map((pro) => (
                <li key={pro.id} className="p-4 border border-gray-200 rounded-lg flex flex-wrap items-start gap-2">
                  <div className="flex-1 min-w-0">
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
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
