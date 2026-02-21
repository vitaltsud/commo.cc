"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Breadcrumbs, BREADCRUMBS_WEBSITE_ID } from "@/components/Breadcrumbs";
import { useT, useLocalePath } from "./LocaleContext";

type ProjectRow = {
  id: number;
  title: string;
  description: string | null;
  status: string;
  categorySlug: string;
  citySlug: string | null;
  clientName: string;
};

type ProjectsListContentProps = {
  projects: ProjectRow[];
};

export function ProjectsListContent({ projects }: ProjectsListContentProps) {
  const t = useT();
  const path = useLocalePath();
  const statusLabel = (status: string) => (status === "open" ? t("project.statusOpen") : t("project.statusClosed"));
  const breadcrumbItems = [
    { label: t("breadcrumbs.home"), href: path("") },
    { label: t("breadcrumbs.projects"), href: path("projects") },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center px-4 py-12 md:py-16">
        <div className="w-full max-w-4xl mx-auto mb-4">
          <Breadcrumbs
            items={breadcrumbItems}
            pageSchema={{
              name: t("home.projectsSectionTitle"),
              url: path("projects"),
              isPartOf: { "@id": BREADCRUMBS_WEBSITE_ID },
              schemaType: "CollectionPage",
            }}
          />
        </div>
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold text-graphite mb-6">{t("home.projectsSectionTitle")}</h1>
          <ul className="space-y-2">
            {projects.length === 0 ? (
              <li className="text-sm text-gray-500 py-8">{t("search.noProjects")}</li>
            ) : (
              projects.map((p) => (
                <li key={p.id}>
                  <div className="block p-3 rounded-lg border border-gray-200 bg-white hover:border-gray-300 text-sm">
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
      </main>
    </div>
  );
}
