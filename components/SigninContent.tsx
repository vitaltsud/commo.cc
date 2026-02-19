"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { useT, useLocalePath } from "./LocaleContext";

export function SigninContent({ hasGoogleAuth }: { hasGoogleAuth: boolean }) {
  const t = useT();
  const path = useLocalePath();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <h1 className="text-xl font-semibold text-graphite mb-4">{t("signin.title")}</h1>
        {hasGoogleAuth ? (
          <a
            href="/api/auth/signin/google"
            className="px-6 py-3 rounded-lg bg-graphite text-white font-medium hover:bg-graphite/90 transition-colors"
          >
            {t("signin.button")}
          </a>
        ) : (
          <div className="text-center text-gray-500 max-w-md">
            <p className="mb-2">{t("signin.notConfigured")}</p>
            <p className="text-sm">{t("signin.configureHint")}</p>
            <Link href={path("")} className="mt-4 inline-block text-accent font-medium hover:underline">
              {t("signin.backToHome")}
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
