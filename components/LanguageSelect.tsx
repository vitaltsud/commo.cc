"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "./LocaleContext";
import { setLocale } from "@/app/actions/locale";
import { getContentLocalesForCountry } from "@/lib/countries";
import { localeNamesNative } from "@/lib/locales";

function pathWithoutLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  return segments.slice(2).join("/") ?? "";
}

export function LanguageSelect() {
  const pathname = usePathname();
  const { countryCode, localeCode } = useLocale();
  const locales = getContentLocalesForCountry(countryCode);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const code = e.target.value as "en" | "pl" | "ru" | "uk" | "de" | "fr" | "es";
    if (!code) return;
    await setLocale(code, pathWithoutLocale(pathname));
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
