"use client";

import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Breadcrumbs, BREADCRUMBS_WEBSITE_ID } from "@/components/Breadcrumbs";
import { useT, useLocalePath } from "./LocaleContext";
import { useViewMode } from "./ViewModeContext";

export function MyProjectsContent() {
  const t = useT();
  const path = useLocalePath();
  const { setViewMode } = useViewMode();
  useEffect(() => {
    setViewMode("client");
  }, [setViewMode]);
  const breadcrumbItems = [
    { label: t("breadcrumbs.home"), href: path("") },
    { label: t("header.myProjects"), href: path("my-projects") },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        <Breadcrumbs
          items={breadcrumbItems}
          pageSchema={{
            name: t("header.myProjects"),
            url: path("my-projects"),
            isPartOf: { "@id": BREADCRUMBS_WEBSITE_ID },
          }}
        />
        <h1 className="text-2xl font-semibold text-graphite mb-4">{t("header.myProjects")}</h1>
        <p className="text-gray-600 mb-6">{t("myProjects.intro")}</p>
        <p className="text-sm text-gray-500">{t("myProjects.comingSoon")}</p>
      </main>
    </div>
  );
}
