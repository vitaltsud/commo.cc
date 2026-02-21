"use client";

import Link from "next/link";
import { useLocale, useT } from "./LocaleContext";
import { getContentLocalesForCountrySorted } from "@/lib/countries";
import { localeNamesNative } from "@/lib/locales";
import { localePath } from "@/lib/paths";
import type { LocaleCode } from "@/lib/countries";

export function HomeLanguageBlock() {
  const t = useT();
  const { countryCode, localeCode, citySlug } = useLocale();
  const locales = getContentLocalesForCountrySorted(countryCode);

  return (
    <section className="w-full max-w-4xl mx-auto mt-8 py-6 px-4 rounded-xl bg-gray-50 border border-gray-100" aria-labelledby="home-language-title">
      <h2 id="home-language-title" className="text-lg font-semibold text-graphite text-center mb-3">
        {t("home.chooseLanguage")}
      </h2>
      <div className="flex flex-wrap justify-center gap-2">
        {locales.map((loc) => {
          const name = localeNamesNative[loc] ?? loc;
          const isCurrent = loc === localeCode;
          const href = localePath(countryCode, loc as LocaleCode, "", citySlug);
          if (locales.length === 1) {
            return (
              <span
                key={loc}
                className="rounded-lg px-4 py-2 text-sm font-medium bg-accent text-white"
                aria-current="true"
              >
                {name}
              </span>
            );
          }
          return (
            <Link
              key={loc}
              href={href}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isCurrent
                  ? "bg-accent text-white"
                  : "bg-gray-100 text-graphite hover:bg-gray-200"
              }`}
              aria-current={isCurrent ? "true" : undefined}
            >
              {name}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
