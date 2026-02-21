"use client";

import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Breadcrumbs, BREADCRUMBS_WEBSITE_ID } from "@/components/Breadcrumbs";
import { useT, useLocalePath } from "./LocaleContext";
import { useViewMode } from "./ViewModeContext";

type Props = {
  hasProProfile: boolean;
  isVerified: boolean;
  profiles: { id: number; verified: boolean; categorySlug: string }[];
};

export function ProDashboardContent({ hasProProfile, isVerified, profiles }: Props) {
  const t = useT();
  const path = useLocalePath();
  const { setViewMode } = useViewMode();
  useEffect(() => {
    setViewMode("master");
  }, [setViewMode]);
  const breadcrumbItems = [
    { label: t("breadcrumbs.home"), href: path("") },
    { label: t("header.proDashboard"), href: path("pro") },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        <Breadcrumbs
          items={breadcrumbItems}
          pageSchema={{
            name: t("header.proDashboard"),
            url: path("pro"),
            isPartOf: { "@id": BREADCRUMBS_WEBSITE_ID },
          }}
        />
        <h1 className="text-2xl font-semibold text-graphite mb-4">{t("header.proDashboard")}</h1>

        {!hasProProfile && (
          <section className="rounded-lg border border-amber-200 bg-amber-50 p-6">
            <h2 className="font-medium text-graphite mb-2">{t("pro.becomeMaster")}</h2>
            <p className="text-sm text-gray-600 mb-4">{t("pro.verificationRequired")}</p>
            <p className="text-sm text-gray-500">{t("pro.verificationComingSoon")}</p>
          </section>
        )}

        {hasProProfile && !isVerified && (
          <section className="rounded-lg border border-amber-200 bg-amber-50 p-6">
            <h2 className="font-medium text-graphite mb-2">{t("pro.pendingVerification")}</h2>
            <p className="text-sm text-gray-600">{t("pro.verificationComingSoon")}</p>
          </section>
        )}

        {hasProProfile && isVerified && (
          <section>
            <p className="text-gray-600 mb-4">{t("pro.dashboardIntro")}</p>
            <ul className="space-y-2">
              {profiles.filter((p) => p.verified).map((p) => (
                <li key={p.id} className="flex items-center gap-2 text-sm text-graphite">
                  <span className="text-accent">✓</span>
                  {t("category." + p.categorySlug as "category.plumbing")}
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-500 mt-6">{t("pro.dashboardComingSoon")}</p>
          </section>
        )}
      </main>
    </div>
  );
}
