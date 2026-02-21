"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "./LocaleContext";
import { setLocale } from "@/app/actions/locale";
import { pathWithoutLocale } from "@/lib/paths";
import { getContentLocalesForCountrySorted, type LocaleCode } from "@/lib/countries";
import { localeNamesNative } from "@/lib/locales";

export function LanguageSelect() {
  const pathname = usePathname();
  const { countryCode, localeCode, citySlug } = useLocale();
  const locales = getContentLocalesForCountrySorted(countryCode);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const code = e.target.value;
    if (!code) return;
    await setLocale(code as LocaleCode, pathWithoutLocale(pathname, countryCode), citySlug);
  }

  return (
    <label className="flex items-center gap-2 text-sm text-graphite">
      <select
        value={localeCode}
        onChange={handleChange}
        className="border border-gray-300 rounded px-2 py-1 text-graphite bg-white focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label="Content language"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeNamesNative[loc] ?? loc}
          </option>
        ))}
      </select>
    </label>
  );
}
