"use client";

import Link from "next/link";
import { useT, useLocalePath } from "./LocaleContext";
import { CountrySelect } from "./CountrySelect";
import { LanguageSelect } from "./LanguageSelect";

export function Header() {
  const t = useT();
  const path = useLocalePath();
  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4 flex-wrap">
        <Link href={path("")} className="text-graphite font-medium">
          {t("header.logo")}
        </Link>
        <div className="flex items-center gap-4">
          <CountrySelect />
          <LanguageSelect />
          <nav className="flex items-center gap-4 sm:gap-6 text-sm text-graphite">
            <Link href={path("how-it-works")} className="hover:text-accent transition-colors">
              {t("header.howItWorks")}
            </Link>
            <Link href={path("for-pros")} className="hover:text-accent transition-colors">
              {t("header.forPros")}
            </Link>
            <Link href={path("settings")} className="hover:text-accent transition-colors">
              {t("header.settings")}
            </Link>
            <Link href={path("signin")} className="text-accent font-medium hover:underline">
              {t("header.signIn")}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
