"use client";

import { Header } from "@/components/Header";
import { Breadcrumbs, BREADCRUMBS_WEBSITE_ID } from "@/components/Breadcrumbs";
import { useT, useLocalePath } from "./LocaleContext";

type Props = {
  pathSuffix: string;
  titleKey: string;
  children: React.ReactNode;
};

export function StaticPageWithBreadcrumbs({ pathSuffix, titleKey, children }: Props) {
  const t = useT();
  const path = useLocalePath();
  const breadcrumbItems = [
    { label: t("breadcrumbs.home"), href: path("") },
    { label: t(titleKey as "breadcrumbs.privacyPolicy"), href: path(pathSuffix) },
  ];
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-10">
        <Breadcrumbs
          items={breadcrumbItems}
          pageSchema={{
            name: t(titleKey as "breadcrumbs.privacyPolicy"),
            url: path(pathSuffix),
            isPartOf: { "@id": BREADCRUMBS_WEBSITE_ID },
          }}
        />
        <h1 className="text-2xl font-semibold text-graphite mb-4">{t(titleKey as "breadcrumbs.privacyPolicy")}</h1>
        {children}
      </main>
    </div>
  );
}
