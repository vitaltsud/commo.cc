"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "./LocaleContext";
import { setCity } from "@/app/actions/locale";
import { pathWithoutLocale } from "@/lib/paths";
import { getNested } from "@/lib/i18n";
import { CITY_SLUGS_BY_COUNTRY } from "@/lib/city-slugs";

export function CitySelect() {
  const pathname = usePathname();
  const { countryCode, citySlug, messages } = useLocale();
  const label = getNested(messages, "search.filterCity") ?? "City";
  const allCitiesLabel = getNested(messages, "search.allCities") ?? "All cities";
  const slugs = CITY_SLUGS_BY_COUNTRY[countryCode] ?? [];

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const slug = value === "" ? null : value;
    await setCity(slug, pathWithoutLocale(pathname, countryCode));
  }

  if (slugs.length === 0) return null;

  return (
    <label className="flex items-center gap-2 text-sm text-graphite">
      <span className="sr-only">{label}</span>
      <select
        value={citySlug ?? ""}
        onChange={handleChange}
        className="border border-gray-300 rounded px-2 py-1 text-graphite bg-white focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label={label}
      >
        <option value="">{allCitiesLabel}</option>
        {slugs.map((slug) => (
          <option key={slug} value={slug}>
            {getNested(messages, `city.${slug}` as "city.warsaw") ?? slug}
          </option>
        ))}
      </select>
    </label>
  );
}
