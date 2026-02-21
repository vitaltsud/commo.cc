"use client";

import { Header } from "@/components/Header";
import { Breadcrumbs, BREADCRUMBS_WEBSITE_ID } from "@/components/Breadcrumbs";
import { useT, useLocalePath } from "./LocaleContext";

export function HowItWorksContent() {
  const t = useT();
  const path = useLocalePath();
  const breadcrumbItems = [
    { label: t("breadcrumbs.home"), href: path("") },
    { label: t("breadcrumbs.howItWorks"), href: path("how-it-works") },
  ];
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-12">
        <Breadcrumbs
          items={breadcrumbItems}
          pageSchema={{ name: t("howItWorks.title"), url: path("how-it-works"), isPartOf: { "@id": BREADCRUMBS_WEBSITE_ID } }}
        />
        <h1 className="text-2xl font-semibold text-graphite mb-6">{t("howItWorks.title")}</h1>
        <ol className="space-y-6 text-graphite">
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 text-accent font-medium flex items-center justify-center">1</span>
            <div>
              <strong>{t("howItWorks.step1Title")}</strong> {t("howItWorks.step1Desc")}
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 text-accent font-medium flex items-center justify-center">2</span>
            <div>
              <strong>{t("howItWorks.step2Title")}</strong> {t("howItWorks.step2Desc")}
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 text-accent font-medium flex items-center justify-center">3</span>
            <div>
              <strong>{t("howItWorks.step3Title")}</strong> {t("howItWorks.step3Desc")}
            </div>
          </li>
        </ol>
      </main>
    </div>
  );
}
