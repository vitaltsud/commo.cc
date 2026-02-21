"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale, useT, useLocalePath } from "./LocaleContext";
import { getCountryByCode, getCountryNameInLocale } from "@/lib/countries";
import { CitySelect } from "./CitySelect";
import { LanguageDropdown } from "./LanguageDropdown";
import { UserMenu } from "./UserMenu";

const NAV_LINKS = [
  { href: "projects", key: "breadcrumbs.projects" },
  { href: "contractors", key: "breadcrumbs.contractors" },
  { href: "how-it-works", key: "header.howItWorks" },
] as const;

export function Header() {
  const t = useT();
  const path = useLocalePath();
  const { countryCode, localeCode } = useLocale();
  const country = getCountryByCode(countryCode);
  const countryLabel = country ? getCountryNameInLocale(country, localeCode) : null;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navContent = (
    <>
      {NAV_LINKS.map(({ href, key }) => (
        <Link
          key={href}
          href={path(href)}
          onClick={() => setMobileMenuOpen(false)}
          className="hover:text-accent transition-colors"
        >
          {t(key)}
        </Link>
      ))}
      <CitySelect />
      <LanguageDropdown />
      <UserMenu />
    </>
  );

  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-20">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href={path("")} className="text-graphite font-medium flex items-center gap-2 min-w-0 shrink">
          <span className="truncate">{t("header.logo")}</span>
          {countryLabel && (
            <>
              <span className="text-gray-400 font-normal shrink-0" aria-hidden>|</span>
              <span className="hidden sm:inline truncate">{countryLabel}</span>
            </>
          )}
        </Link>
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm text-graphite" aria-label="Main">
          {navContent}
        </nav>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((o) => !o)}
          className="md:hidden p-2 -mr-2 rounded-lg text-graphite hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-accent min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      {mobileMenuOpen && (
        <div
          className="md:hidden absolute top-14 left-0 right-0 bg-white border-b border-gray-200 shadow-lg max-h-[calc(100vh-3.5rem)] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          <nav className="flex flex-col p-4 gap-1 text-sm text-graphite" aria-label="Main">
            {NAV_LINKS.map(({ href, key }) => (
              <Link
                key={href}
                href={path(href)}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-4 rounded-lg hover:bg-gray-50 hover:text-accent font-medium min-h-[44px] flex items-center"
              >
                {t(key)}
              </Link>
            ))}
            <div className="border-t border-gray-100 mt-2 pt-4 flex flex-col gap-3">
              <div className="px-4">
                <CitySelect />
              </div>
              <div className="px-4">
                <LanguageDropdown />
              </div>
              <div className="px-4 pb-2">
                <UserMenu />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
