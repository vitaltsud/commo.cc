/**
 * Locale = language_COUNTRY (e.g. en_pl, uk_ua, ru_RU).
 * URL segment: lowercase en_pl, pl_pl, uk_ua.
 */

import { countries, getCountryByCode, getContentLocalesForCountry } from "@/lib/countries";
import type { CountryCode, LocaleCode } from "@/lib/countries";

export type LocaleSegment = string; // e.g. "en_pl", "uk_ua"

/** All valid locale segments for URL (lang_country, lowercase). */
export function getValidLocaleSegments(): LocaleSegment[] {
  const out: LocaleSegment[] = [];
  for (const c of countries) {
    for (const lang of c.contentLocales) {
      out.push(`${lang}_${c.code}`);
    }
  }
  return out;
}

const validSet = new Set(getValidLocaleSegments());

export function isValidLocaleSegment(segment: string): segment is LocaleSegment {
  return validSet.has(segment.toLowerCase());
}

/** Parse "en_pl" -> { lang: "en", country: "pl" }. */
export function parseLocaleSegment(segment: string): { lang: LocaleCode; country: CountryCode } | null {
  const s = segment.toLowerCase();
  if (!validSet.has(s)) return null;
  const [lang, country] = s.split("_") as [string, string];
  return { lang: lang as LocaleCode, country: country as CountryCode };
}

/** Build locale segment from lang + country. */
export function toLocaleSegment(lang: LocaleCode, country: CountryCode): LocaleSegment {
  return `${lang}_${country}`.toLowerCase();
}

/** Default locale segment (e.g. for redirect). */
export function getDefaultLocaleSegment(): LocaleSegment {
  const c = getCountryByCode("pl");
  const lang = c?.contentLocales[0] ?? "en";
  return toLocaleSegment(lang as LocaleCode, "pl");
}

/** First content locale for country (e.g. "en" for Poland when opening in English). */
export function getEnglishLocaleForCountry(countryCode: CountryCode): LocaleSegment | null {
  const country = getCountryByCode(countryCode);
  if (!country) return null;
  const en = country.contentLocales.includes("en") ? "en" : country.contentLocales[0];
  return toLocaleSegment(en as LocaleCode, countryCode);
}
