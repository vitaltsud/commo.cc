"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "./LocaleContext";
import { setLocale } from "@/app/actions/locale";
import { pathWithoutLocale } from "@/lib/paths";
import { getContentLocalesForCountrySorted } from "@/lib/countries";
import type { LocaleCode } from "@/lib/countries";

/** Two-letter label for dropdown: En, Pl, Ru, Uk, De, ... */
function shortLabel(loc: string): string {
  return loc.length >= 2 ? loc.slice(0, 2).toUpperCase() : loc.toUpperCase();
}

export function LanguageDropdown() {
  const pathname = usePathname();
  const { countryCode, localeCode, citySlug } = useLocale();
  const locales = getContentLocalesForCountrySorted(countryCode);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const code = e.target.value;
    if (!code) return;
    await setLocale(code as LocaleCode, pathWithoutLocale(pathname, countryCode), citySlug);
  }

  if (locales.length <= 1) return null;

  return (
    <label className="flex items-center gap-1 text-sm text-graphite">
      <select
        value={localeCode}
        onChange={handleChange}
        className="border border-gray-300 rounded px-2 py-1 text-graphite bg-white focus:outline-none focus:ring-2 focus:ring-accent min-w-[3rem]"
        aria-label="Language"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {shortLabel(loc)}
          </option>
        ))}
      </select>
    </label>
  );
}
