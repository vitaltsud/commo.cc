"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { useT, useLocalePath } from "./LocaleContext";

export function ForProsContent() {
  const t = useT();
  const path = useLocalePath();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold text-graphite mb-6">{t("forPros.title")}</h1>
        <ul className="space-y-4 text-graphite">
          <li><strong>{t("forPros.idVerification")}</strong></li>
          <li><strong>{t("forPros.noCommission")}</strong></li>
          <li><strong>{t("forPros.loyaltyDiscount")}</strong></li>
          <li><strong>{t("forPros.immutableRatings")}</strong></li>
        </ul>
        <p className="mt-8">
          <Link href={path("signin")} className="text-accent font-medium hover:underline">{t("forPros.signInToStart")}</Link>
        </p>
      </main>
    </div>
  );
}
