"use client";

import Link from "next/link";
import { useLocale, useT, useLocalePath } from "./LocaleContext";
import { countriesSortedAlphabetically, getContentLocalesForCountry, getCountryNameInLocale } from "@/lib/countries";
import { localePath } from "@/lib/paths";
import { localeNamesNative } from "@/lib/locales";
import type { LocaleCode } from "@/lib/countries";

const FLAG_CDN = "https://flagcdn.com";

/** Flag image URL for ISO 3166-1 alpha-2 country code (lowercase). */
function countryFlagSrc(code: string): string {
  if (code.length !== 2) return "";
  return `${FLAG_CDN}/w80/${code.toLowerCase()}.png`;
}

const LANDING_LOCALES: LocaleCode[] = ["en", "pl", "ru", "uk", "de", "es", "it"];

const BLOCK_KEYS = [
  { titleKey: "landing.block1Title", descKey: "landing.block1Desc" },
  { titleKey: "landing.block2Title", descKey: "landing.block2Desc" },
  { titleKey: "landing.block3Title", descKey: "landing.block3Desc" },
];

export function LandingContent() {
  const t = useT();
  const { localeCode } = useLocale();
  const path = useLocalePath();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-xl font-semibold text-graphite">
            commo.cc
          </Link>
          <nav className="flex flex-wrap items-center gap-2" aria-label={t("landing.chooseLanguage")}>
            {LANDING_LOCALES.map((lang) => {
              const isCurrent = lang === localeCode;
              const href = lang === "en" ? "/" : `/?lang=${lang}`;
              return (
                <Link
                  key={lang}
                  href={href}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    isCurrent ? "bg-accent text-white" : "text-graphite hover:bg-gray-100"
                  }`}
                  aria-current={isCurrent ? "true" : undefined}
                >
                  {localeNamesNative[lang] ?? lang}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-semibold text-graphite text-center mb-4">
          {t("landing.title")}
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-xl mx-auto">
          {t("landing.subtitle")}
        </p>

        <section className="flex flex-col items-center mb-12 py-8 px-4 rounded-xl bg-gray-50 border border-gray-100" aria-label={t("landing.chooseCountry")}>
          <ul className="flex flex-wrap justify-center gap-4 max-w-2xl">
            {countriesSortedAlphabetically.map((c) => {
              const locales = getContentLocalesForCountry(c.code);
              const targetLang = locales.includes(localeCode) ? localeCode : (locales[0] ?? "en");
              const href = localePath(c.code, targetLang);
              return (
                <li key={c.code}>
                  <Link
                    href={href}
                    className="flex flex-col items-center gap-2 py-4 px-5 rounded-xl border border-gray-200 bg-white text-graphite shadow-sm hover:border-accent hover:bg-accent/5 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                    aria-label={getCountryNameInLocale(c, localeCode)}
                  >
                    <img
                      src={countryFlagSrc(c.code)}
                      alt=""
                      width={40}
                      height={30}
                      className="rounded object-cover shrink-0"
                      loading="lazy"
                    />
                    <span className="font-semibold text-graphite">{getCountryNameInLocale(c, localeCode)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="grid gap-6 md:grid-cols-3 mb-16">
          {BLOCK_KEYS.map(({ titleKey, descKey }) => (
            <div
              key={titleKey}
              className="p-5 rounded-xl border border-gray-200 text-graphite"
            >
              <h2 className="font-semibold text-lg mb-2">{t(titleKey)}</h2>
              <p className="text-sm text-gray-600">{t(descKey)}</p>
            </div>
          ))}
        </section>
      </main>
      <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <span>© {new Date().getFullYear()} commo.cc</span>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
            <Link href={path("privacy-policy")} className="hover:text-accent transition-colors">
              {t("landing.privacyPolicy")}
            </Link>
            <Link href={path("terms")} className="hover:text-accent transition-colors">
              {t("landing.termsOfUse")}
            </Link>
            <Link href="/" className="hover:text-accent transition-colors">
              {t("landing.global")}
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
