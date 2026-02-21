"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Breadcrumbs, BREADCRUMBS_WEBSITE_ID } from "@/components/Breadcrumbs";
import { useT, useLocalePath } from "./LocaleContext";

export function ForProsContent() {
  const t = useT();
  const path = useLocalePath();
  const breadcrumbItems = [
    { label: t("breadcrumbs.home"), href: path("") },
    { label: t("breadcrumbs.forPros"), href: path("for-pros") },
  ];
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-12">
        <Breadcrumbs
          items={breadcrumbItems}
          pageSchema={{ name: t("forPros.title"), url: path("for-pros"), isPartOf: { "@id": BREADCRUMBS_WEBSITE_ID } }}
        />
        <h1 className="text-2xl font-semibold text-graphite mb-6">{t("forPros.title")}</h1>
        <ul className="space-y-4 text-graphite">
          <li><strong>{t("forPros.idVerification")}</strong></li>
          <li><strong>{t("forPros.noCommission")}</strong></li>
          <li><strong>{t("forPros.loyaltyDiscount")}</strong></li>
          <li><strong>{t("forPros.immutableRatings")}</strong></li>
        </ul>
        <p className="mt-8">
          <Link href={`${path("signin")}?callbackUrl=${encodeURIComponent(path("for-pros"))}`} className="text-accent font-medium hover:underline">{t("forPros.signInToStart")}</Link>
        </p>
      </main>
    </div>
  );
}
