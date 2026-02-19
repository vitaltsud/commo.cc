"use client";

import { Header } from "@/components/Header";
import { useT } from "./LocaleContext";

export function HowItWorksContent() {
  const t = useT();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
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
