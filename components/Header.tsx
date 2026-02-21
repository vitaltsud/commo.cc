"use client";

import Link from "next/link";
import { useLocale, useT, useLocalePath } from "./LocaleContext";
import { getCountryByCode, getCountryNameInLocale } from "@/lib/countries";
import { CitySelect } from "./CitySelect";
import { LanguageDropdown } from "./LanguageDropdown";
import { UserMenu } from "./UserMenu";

export function Header() {
  const t = useT();
  const path = useLocalePath();
  const { countryCode, localeCode } = useLocale();
  const country = getCountryByCode(countryCode);
  const countryLabel = country ? getCountryNameInLocale(country, localeCode) : null;
  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4 flex-wrap">
        <Link href={path("")} className="text-graphite font-medium flex items-center gap-2">
          <span>{t("header.logo")}</span>
          {countryLabel && (
            <>
              <span className="text-gray-400 font-normal" aria-hidden>|</span>
              <span>{countryLabel}</span>
            </>
          )}
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6 text-sm text-graphite">
          <Link href={path("projects")} className="hover:text-accent transition-colors">
            {t("breadcrumbs.projects")}
          </Link>
          <Link href={path("contractors")} className="hover:text-accent transition-colors">
            {t("breadcrumbs.contractors")}
          </Link>
          <Link href={path("how-it-works")} className="hover:text-accent transition-colors">
            {t("header.howItWorks")}
          </Link>
          <CitySelect />
          <LanguageDropdown />
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}
